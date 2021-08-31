import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { postgresHandler } from '../dataSources/postgres';
import { CreateResidenceInput, FieldError, ResidenceResponse } from '../types';
import { assembleResidence, unpackLocation } from '../utils/mapUtils';
import { Residence } from './residence';

export async function createResidence(
    this: postgresHandler,
    input: CreateResidenceInput,
    locationFromPlaceID: (
        place_id: string
    ) => Promise<GeocodeResult | FieldError>
): Promise<ResidenceResponse> {
    const locationResult = await locationFromPlaceID(input.google_place_id);
    if (locationResult instanceof FieldError) {
        return { errors: [locationResult] };
    }

    const args = {
        ...input,
        ...unpackLocation(locationResult),
        geog: this.knexPostgis.geographyFromText(
            'Point(' +
                locationResult.geometry.location.lat +
                ' ' +
                locationResult.geometry.location.lng +
                ')'
        ),
    };

    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
        .insert(args)
        .returning('res_id')
        .then(async (ids) => {
            await this.getResidencesById(ids)
                .then((res) => {
                    r.residences = res.residences;
                })
                .catch(
                    (e) =>
                        (r.errors = [
                            {
                                field: 'fetch residence',
                                message: e.toString(),
                            },
                        ])
                );
        })
        .catch(
            (e) =>
                (r.errors = [
                    { field: 'create residence', message: e.toString() },
                ])
        );

    return r;
}

export async function getResidencesById(
    this: postgresHandler,
    ids: number[]
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};

    await this.knex<Residence>('residences')
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
            this.knexPostgis.x(this.knexPostgis.geometry('geog')),
            this.knexPostgis.y(this.knexPostgis.geometry('geog')),
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
            r.residences = assembleResidence(residences);
        })
        .catch(
            (e) =>
                (r.errors = [
                    { field: 'query residence', message: e.toString() },
                ])
        );

    return r;
}

export async function getResidencesObject(
    this: postgresHandler,
    obj: Partial<Residence>
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
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
            this.knexPostgis.x(this.knexPostgis.geometry('geog')),
            this.knexPostgis.y(this.knexPostgis.geometry('geog')),
            this.knex.raw('AVG(rating) as avg_rating'),
            this.knex.raw('AVG(rent) as avg_rent'),
            'residences.created_at',
            'residences.updated_at',
        ])
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .where(obj)
        .groupBy('residences.res_id')
        .then((residences: any) => {
            r.residences = assembleResidence(residences);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

export async function getResidencesLimit(
    this: postgresHandler,
    limit: number
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
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
            this.knexPostgis.x(this.knexPostgis.geometry('geog')),
            this.knexPostgis.y(this.knexPostgis.geometry('geog')),
            this.knex.raw('AVG(rating) as avg_rating'),
            this.knex.raw('AVG(rent) as avg_rent'),
            'residences.created_at',
            'residences.updated_at',
        ])
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .groupBy('residences.res_id')
        .limit(limit)
        .then((residences: any) => {
            r.residences = assembleResidence(residences);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}
