import { postgresHandler } from '../dataSources/postgres';
import { QueryOrderChoice, ResidenceSortBy } from '../types/enum_types';
import { ResidenceSortByInput } from '../types/input_types';
import {
    FieldError,
    ResidenceResponse,
    SingleResidenceResponse,
} from '../types/object_types';
import { Residence } from './Residence';

export async function createResidence(
    this: postgresHandler,
    loc_id: number,
    unit: string
): Promise<SingleResidenceResponse> {
    const r: SingleResidenceResponse = {};
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
    limit = 10
): Promise<ResidenceResponse> {
    const r: ResidenceResponse = {};
    await this.knex<Residence>('residences_enhanced')
        .select('*')
        .where(obj)
        .limit(limit)
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
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

export async function getResidencesById(
    this: postgresHandler,
    ids: number[]
): Promise<ResidenceResponse> {
    const r: ResidenceResponse = {};
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
    res_id: number
): Promise<SingleResidenceResponse> {
    const r: SingleResidenceResponse = {};
    await this.knex<Residence>('residences_enhanced')
        .select('*')
        .where('res_id', '=', res_id)
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

export async function residenceExists(
    this: postgresHandler,
    loc_id: number,
    unit = 'PH'
): Promise<number | null> {
    let r: number | null = null;
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
    unit = 'PH'
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

export async function saveResidence(
    this: postgresHandler,
    res_id: number,
    user_id: number
): Promise<SingleResidenceResponse> {
    const r: SingleResidenceResponse = {};
    await this.knex('saved_residences')
        .insert({ res_id, user_id })
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
        .catch(
            (e) =>
                (r.errors = [
                    { field: 'query residence', message: e.toString() },
                ])
        );
    return r;
}

export async function getSavedResidences(
    this: postgresHandler,
    user_id: number
): Promise<ResidenceResponse> {
    const r: ResidenceResponse = {};

    const saved_residences = this.knex('saved_residences')
        .select('res_id')
        .where({ user_id: user_id });

    await this.knex('residences_enhanced')
        .select('*')
        .where('res_id', 'in', saved_residences)
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
