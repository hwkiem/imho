import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { postgresHandler } from '../dataSources/postgres';
import { QueryOrderChoice, ResidenceSortBy } from '../types/enum_types';
import {
    GeoBoundaryInput,
    PartialResidence,
    ResidenceSortByInput,
} from '../types/input_types';
import {
    FieldError,
    ResidenceResponse,
    SingleResidenceResponse,
} from '../types/object_types';

import { assembleResidence } from '../utils/mapUtils';
import { Residence } from './Residence';

export async function createResidence(
    this: postgresHandler,
    loc_id: number,
    unit: string
): Promise<SingleResidenceResponse> {
    let r: SingleResidenceResponse = {};
    await this.knex<Residence>('residences')
        .insert({ loc_id: loc_id, unit: unit })
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
    await this.knex<Residence>('residences_enhanced')
        .select('*')
        .where(obj)
        .limit(limit)
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
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
    await this.knex<Residence>('residences_enhanced')
        .select('*')
        .where('res_id', 'in', ids)
        .then((residences) => {
            r.residences = residences;
        })
        .catch(
            (e) =>
                (r.errors = [
                    { field: 'query residence', message: e.toString() },
                ])
        );

    return r;
}

export async function getSingleResidenceById(
    this: postgresHandler,
    ids: number[]
): Promise<SingleResidenceResponse> {
    let r: SingleResidenceResponse = {};
    await this.knex<Residence>('residences_enhanced')
        .select('*')
        .where('res_id', 'in', ids)
        .limit(1)
        .then((residences) => {
            r.residence = residences[0];
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
    await this.knex<Residence>('residences_enhanced')
        .select('*')
        .where(obj)
        .orderByRaw(
            "residences_enhanced.geog <-> 'POINT(" +
                locationResult.geometry.location.lng +
                ' ' +
                locationResult.geometry.location.lat +
                ")'::geometry"
        )
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
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

    await this.knex('residences_enhanced')
        .select('*')
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
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .limit(limit)
        .then((residences: any) => {
            r.residences = assembleResidence(residences);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

export async function residenceExists(
    this: postgresHandler,
    loc_id: number,
    unit: string
): Promise<number | null> {
    var r: number | null = null;
    await this.knex('residences')
        .select('res_id')
        .where({ loc_id: loc_id, unit: unit })
        .then((ids) => {
            if (ids.length == 0) {
                r = null;
            } else {
                r = ids[0].res_id;
            }
        })
        .catch(() => {
            r = null;
        });

    return r;
}

export async function createResidenceIfNotExists(
    this: postgresHandler,
    loc_id: number,
    unit: string
): Promise<number | FieldError> {
    const resId = await this.residenceExists(loc_id, unit); // unique tuple
    // does residence exist
    if (resId === null) {
        // create one
        const res = await this.createResidence(loc_id, unit);
        if (res.errors) return res.errors[0];
        if (res.residence) return res.residence.res_id;
        return { field: 'create location', message: 'empty response' };
    } else {
        return resId;
    }
}
