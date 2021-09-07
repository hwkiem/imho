import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { postgresHandler } from '../dataSources/postgres';
import {
    CreateResidenceInput,
    GeoBoundaryInput,
    ResidenceSortByInput,
} from '../types/input_types';
import { FieldError, ResidenceResponse } from '../types/object_types';

import { assembleResidence, unpackLocation } from '../utils/mapUtils';
import { Residence } from './residence';

export async function createResidence(
    this: postgresHandler,
    locationResult: GeocodeResult | FieldError,
    input: CreateResidenceInput
): Promise<ResidenceResponse> {
    if (locationResult instanceof FieldError) {
        return { errors: [locationResult] };
    }
    const args = {
        ...input,
        ...unpackLocation(locationResult),
        geog: this.knexPostgis.geographyFromText(
            'Point(' +
                locationResult.geometry.location.lng +
                ' ' +
                locationResult.geometry.location.lat +
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
                    r = res;
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
        .catch((e) => {
            if (e.code == 23505) {
                r.errors = [
                    {
                        field: 'create residence',
                        message: 'this residence already exists',
                    },
                ];
            } else {
                r.errors = [
                    { field: 'create residence', message: e.toString() },
                ];
            }
        });

    return r;
}

export async function getResidencesById(
    this: postgresHandler,
    ids: number[]
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
        .select(this.residenceColumns())
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
    obj: Partial<Residence>,
    limit: number = 10
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
        .select(this.residenceColumns())
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .where(obj)
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

export async function getResidencesNearArea(
    this: postgresHandler,
    obj: Partial<Residence>,
    locationResult: GeocodeResult,
    limit: number = 10
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
        .select(this.residenceColumns())
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .where(obj)
        .groupBy('residences.res_id')
        .orderByRaw(
            "residences.geog <-> 'POINT(" +
                locationResult.geometry.location.lng +
                ' ' +
                locationResult.geometry.location.lat +
                ")'::geometry"
        )
        .limit(limit)
        .then((residences: any) => {
            r.residences = assembleResidence(residences);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

export async function getResidencesBoundingBox(
    this: postgresHandler,
    perimeter: GeoBoundaryInput,
    limit: number = 10
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};

    await this.knex<Residence>('residences')
        .select(this.residenceColumns())
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .where(
            this.knexPostgis.boundingBoxContains(
                this.knexPostgis.makeEnvelope(
                    perimeter.xMin,
                    perimeter.yMin,
                    perimeter.xMax,
                    perimeter.yMax,
                    4326
                ),
                this.knexPostgis.geometry('geog')
            )
        )
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

export async function getResidencesSortBy(
    this: postgresHandler,
    obj: Partial<Residence>,
    params: ResidenceSortByInput,
    limit: number = 10
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
        .select(this.residenceColumns())
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .where(obj)
        .whereNotNull(params.attribute == 'avg_rent' ? 'rent' : 'rating')
        .groupBy('residences.res_id')
        .orderBy(params.attribute, params.sort)
        .limit(limit)
        .then((residences: any) => {
            r.residences = assembleResidence(residences);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}
