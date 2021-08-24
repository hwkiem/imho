import { SQLDataSource } from 'datasource-sql'
import {
    Coords,
    CreateResidenceInput,
    FieldError,
    RegisterInput,
    ResidenceResponse,
    ReviewResponse,
    UserResponse,
    WriteReviewArgs,
} from '../types'
import argon2 from 'argon2'
import { UserGQL } from '../User/user'
import { ResidenceGQL } from '../Residence/residence'
import { GeocodeResult } from '@googlemaps/google-maps-services-js'
import { assembleResidence, unpackLocation } from '../utils/mapUtils'
import KnexPostgis from 'knex-postgis'
import { ReviewGQL } from '../Review/reviews'

const knexConfig = {
    client: 'pg',
    connection: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT!),
    },
}
export class postgresHandler extends SQLDataSource {
    #knexPostgis: KnexPostgis.KnexPostgis

    constructor() {
        super(knexConfig)
        this.#knexPostgis = KnexPostgis(this.knex)
    }
    // @Users
    async getUsersById(ids: [number]): Promise<UserResponse> {
        let r: UserResponse = {}
        await this.knex<UserGQL>('users')
            .select('*')
            .where('user_id', 'in', ids)
            .then((users) => (r.users = users))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query user', message: e.toString() },
                    ])
            )
        return r
    }

    async getUsersLimit(limit: number): Promise<UserResponse> {
        let r: UserResponse = {}
        await this.knex<UserGQL>('users')
            .select('*')
            .limit(limit)
            .then((users) => (r.users = users))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query user', message: e.toString() },
                    ])
            )
        return r
    }

    async getUsersObject(obj: Partial<UserGQL>): Promise<UserResponse> {
        let r: UserResponse = {}
        await this.knex<UserGQL>('users')
            .select('*')
            .where(obj)
            .then((users) => (r.users = users))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query user', message: e.toString() },
                    ])
            )
        return r
    }

    async createUser(input: RegisterInput): Promise<UserResponse> {
        let r: UserResponse = {}
        input.password = await argon2.hash(input.password)
        const args = {
            ...input,
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }
        await this.knex<UserGQL>('users')
            .insert(args)
            .returning('*')
            .then((users) => (r.users = users))
            .catch((e) => {
                if (e.code === '23505') {
                    r.errors = [{ message: 'email taken', field: 'email' }]
                }
                r.errors = [{ field: 'insert user', message: e.toString() }]
            })
        return r
    }

    async deleteUser(id: number): Promise<UserResponse> {
        let r: UserResponse = {}
        await this.knex<UserGQL>('users')
            .where('user_id', '=', id)
            .del()
            .returning('*')
            .then((user) => (r.users = user))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'delete user', message: e.toString() },
                    ])
            )
        return r
    }

    // @Residences
    async createResidence(
        input: CreateResidenceInput,
        locationFromPlaceID: (
            place_id: string
        ) => Promise<GeocodeResult | FieldError>
    ): Promise<ResidenceResponse> {
        const locationResult = await locationFromPlaceID(input.google_place_id)
        if (locationResult instanceof FieldError) {
            return { errors: [locationResult] }
        }

        const args = {
            ...input,
            ...unpackLocation(locationResult),
            geog: this.#knexPostgis.geographyFromText(
                'Point(' +
                    locationResult.geometry.location.lat +
                    ' ' +
                    locationResult.geometry.location.lng +
                    ')'
            ),
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }

        let r: ResidenceResponse = {}
        await this.knex<ResidenceGQL>('residences')
            .insert(args)
            .returning('res_id')
            .then(async (ids) => {
                await this.getResidencesById(ids)
                    .then((res) => {
                        r.residences = res.residences
                    })
                    .catch(
                        (e) =>
                            (r.errors = [
                                {
                                    field: 'fetch residence',
                                    message: e.toString(),
                                },
                            ])
                    )
            })
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'create residence', message: e.toString() },
                    ])
            )

        return r
    }

    async getResidencesById(ids: number[]): Promise<ResidenceResponse> {
        let r: ResidenceResponse = {}

        await this.knex<ResidenceGQL>('residences')
            .select([
                'residences.res_id',
                'google_place_id',
                'full_address',
                'apt_num',
                'street_num',
                'route',
                'city',
                'state',
                'postal_code',
                this.#knexPostgis.x(this.#knexPostgis.geometry('geog')),
                this.#knexPostgis.y(this.#knexPostgis.geometry('geog')),
                this.knex.raw('AVG(rating) as avg_rating'),
                this.knex.raw('AVG(rent) as avg_rent'),
                'residences.created_at',
                'residences.updated_at',
            ])
            // .from('residences')
            .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
            .where('residences.res_id', 'in', ids)
            .groupBy('residences.res_id')
            .then((residences) => {
                r.residences = assembleResidence(residences)
            })
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query residence', message: e.toString() },
                    ])
            )

        return r
    }

    async getResidencesObject(
        obj: Partial<ResidenceGQL>
    ): Promise<ResidenceResponse> {
        let r: ResidenceResponse = {}
        await this.knex<ResidenceGQL>('residences')
            .select([
                'residences.res_id',
                'google_place_id',
                'full_address',
                'apt_num',
                'street_num',
                'route',
                'city',
                'state',
                'postal_code',
                this.#knexPostgis.x(this.#knexPostgis.geometry('geog')),
                this.#knexPostgis.y(this.#knexPostgis.geometry('geog')),
                this.knex.raw('AVG(rating) as avg_rating'),
                this.knex.raw('AVG(rent) as avg_rent'),
                'residences.created_at',
                'residences.updated_at',
            ])
            .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
            .where(obj)
            .groupBy('residences.res_id')
            .then((residences: any) => {
                r.residences = assembleResidence(residences)
            })
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query user', message: e.toString() },
                    ])
            )
        return r
    }

    async getResidencesLimit(limit: number): Promise<ResidenceResponse> {
        let r: ResidenceResponse = {}
        await this.knex<ResidenceGQL>('residences')
            .select([
                'residences.res_id',
                'google_place_id',
                'full_address',
                'apt_num',
                'street_num',
                'route',
                'city',
                'state',
                'postal_code',
                this.#knexPostgis.x(this.#knexPostgis.geometry('geog')),
                this.#knexPostgis.y(this.#knexPostgis.geometry('geog')),
                this.knex.raw('AVG(rating) as avg_rating'),
                this.knex.raw('AVG(rent) as avg_rent'),
                'residences.created_at',
                'residences.updated_at',
            ])
            .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
            .groupBy('residences.res_id')
            .limit(limit)
            .then((residences: any) => {
                r.residences = assembleResidence(residences)
            })
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query user', message: e.toString() },
                    ])
            )
        return r
    }

    async getCoords(id: number): Promise<Coords> {
        const res = await this.knex.raw(
            `SELECT st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat FROM residences WHERE res_id = ${id}`
        )

        return res.rows[0]
    }

    // @Reviews
    async writeReview(input: WriteReviewArgs): Promise<ReviewResponse> {
        let r: ReviewResponse = {}
        const args = {
            ...input,
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }
        await this.knex<ReviewGQL>('reviews')
            .insert(args)
            .returning('*')
            .then((reviews) => (r.reviews = reviews))
            .catch((e) => {
                if (e.code == 23505) {
                    return {
                        errors: [
                            {
                                message: 'duplicate',
                                field:
                                    'you have already reviewed this residency',
                            },
                        ],
                    }
                }
                return (r.errors = [
                    { field: 'insert review', message: e.toString() },
                ])
            })
        return r
    }

    async getReviewsByUserId(ids: [number]): Promise<ReviewResponse> {
        let r: ReviewResponse = {}
        await this.knex<ReviewGQL>('reviews')
            .select('*')
            .where('user_id', 'in', ids)
            .then((reviews) => (r.reviews = reviews))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query review', message: e.toString() },
                    ])
            )
        return r
    }

    async getReviewsByResidenceId(ids: [number]): Promise<ReviewResponse> {
        let r: ReviewResponse = {}
        await this.knex<ReviewGQL>('reviews')
            .select('*')
            .where('res_id', 'in', ids)
            .then((reviews) => (r.reviews = reviews))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query review', message: e.toString() },
                    ])
            )
        return r
    }

    async getReviewsLimit(limit: number): Promise<ReviewResponse> {
        let r: ReviewResponse = {}
        await this.knex<ReviewGQL>('reviews')
            .select('*')
            .limit(limit)
            .then((reviews) => (r.reviews = reviews))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query review', message: e.toString() },
                    ])
            )
        return r
    }

    async getReviewsObject(obj: Partial<ReviewGQL>): Promise<ReviewResponse> {
        let r: ReviewResponse = {}
        await this.knex<ReviewGQL>('reviews')
            .select('*')
            .where(obj)
            .then((reviews) => (r.reviews = reviews))
            .catch(
                (e) =>
                    (r.errors = [
                        { field: 'query review', message: e.toString() },
                    ])
            )
        return r
    }
}
