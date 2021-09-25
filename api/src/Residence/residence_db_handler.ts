import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { postgresHandler } from '../dataSources/postgres';
import { QueryOrderChoice, ResidenceSortBy } from '../types/enum_types';
import {
    CreateResidenceInput,
    GeoBoundaryInput,
    PartialResidence,
    ResidenceSortByInput,
} from '../types/input_types';
import {
    ResidenceResponse,
    SingleResidenceResponse,
} from '../types/object_types';

import { assembleResidence } from '../utils/mapUtils';
import { Residence } from './Residence';

export async function createResidence(
    this: postgresHandler,
    input: CreateResidenceInput
): Promise<SingleResidenceResponse> {
    let r: SingleResidenceResponse = {};
    const { google_place_id, ...args } = input;
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
