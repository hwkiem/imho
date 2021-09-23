import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { postgresHandler } from '../DataSources/postgres';
import { QueryOrderChoice, ResidenceSortBy } from '../types/enum_types';
import {
    CreateResidenceInput,
    GeoBoundaryInput,
    PartialResidence,
    ResidenceSortByInput,
} from '../types/input_types';
import {
    FieldError,
    ResidenceResponse,
    SingleResidenceResponse,
} from '../types/object_types';

import { assembleResidence, unpackLocation } from '../utils/mapUtils';
import { Residence } from './residence';

export async function createResidence(
    this: postgresHandler,
    locationResult: GeocodeResult | FieldError,
    input: CreateResidenceInput
): Promise<SingleResidenceResponse> {
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

    let r: SingleResidenceResponse = {};
    await this.knex<Residence>('residences')
        .insert(args)
        .returning('res_id')
        .then(async (ids) => {
            await this.getResidencesById(ids)
                .then((res) => {
                    if (res.residences) r.residence = res.residences[0];
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

export async function getResidencesGeneric(
    this: postgresHandler,
    obj: Partial<Residence> = {},
    sort_params: ResidenceSortByInput = {
        attribute: ResidenceSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit: number = 10
): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    await this.knex<Residence>('residences')
        .select(this.residenceColumns())
        .leftOuterJoin('reviews', 'residences.res_id', 'reviews.res_id')
        .where(obj)
        .groupBy('residences.res_id')
        .limit(limit)
        .whereNotNull(sort_params.attribute.substring(4))
        .orderBy(
            sort_params.attribute == ResidenceSortBy.ID
                ? 'residences.res_id'
                : sort_params.attribute,
            sort_params.sort
        )
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

export async function getResidencesNearArea(
    this: postgresHandler,
    locationResult: GeocodeResult,
    obj: Partial<Residence> = {},
    sort_params: ResidenceSortByInput = {
        attribute: ResidenceSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
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
        .whereNotNull(sort_params.attribute.substring(4))
        .orderBy(
            sort_params.attribute == ResidenceSortBy.ID
                ? 'residences.res_id'
                : sort_params.attribute,
            sort_params.sort
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
    filter: PartialResidence = {},
    sort_params: ResidenceSortByInput = {
        attribute: ResidenceSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
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
        .where(filter)
        .whereNotNull(sort_params.attribute.substring(4))
        .orderBy(
            sort_params.attribute == ResidenceSortBy.ID
                ? 'residences.res_id'
                : sort_params.attribute,
            sort_params.sort
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
