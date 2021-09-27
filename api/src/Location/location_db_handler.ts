import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { postgresHandler } from '../dataSources/postgres';
import { LocationSortBy, QueryOrderChoice } from '../types/enum_types';
import {
    CreateLocationInput,
    GeoBoundaryInput,
    LocationSortByInput,
    PartialLocation,
} from '../types/input_types';
import {
    LocationResponse,
    SingleLocationResponse,
} from '../types/object_types';
import { assembleLocation, unpackLocation } from '../utils/mapUtils';
import { Location } from './Location';

export async function createLocation(
    this: postgresHandler,
    locationResult: GeocodeResult,
    input: CreateLocationInput
): Promise<SingleLocationResponse> {
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

    if (!args.street_num) {
        return {
            errors: [
                {
                    field: 'provided location too broad',
                    message: 'must be street number specefic',
                },
            ],
        };
    }

    let r: SingleLocationResponse = {};
    await this.knex<Location>('locations')
        .insert(args)
        .returning('loc_id')
        .then(async (ids) => {
            await this.getLocationsById(ids)
                .then((res) => {
                    if (res.locations) r.location = res.locations[0];
                })
                .catch(
                    (e) =>
                        (r.errors = [
                            {
                                field: 'fetch location',
                                message: e.toString(),
                            },
                        ])
                );
        })
        .catch((e) => {
            // dup place_id
            if (e.code == 23505) {
                r.errors = [
                    {
                        field: 'create location',
                        message: 'this location already exists',
                    },
                ];
            } else {
                r.errors = [
                    { field: 'create location', message: e.toString() },
                ];
            }
        });

    return r;
}

export async function getLocationsById(
    this: postgresHandler,
    ids: number[]
): Promise<LocationResponse> {
    let r: LocationResponse = {};
    await this.knex<Location>('locations_enhanced')
        .select('*')
        .where('loc_id', 'in', ids)
        .then((locations) => {
            r.locations = assembleLocation(locations);
        })
        .catch(
            (e) =>
                (r.errors = [
                    { field: 'query location', message: e.toString() },
                ])
        );

    return r;
}

export async function getLocationsNearArea(
    this: postgresHandler,
    locationResult: GeocodeResult,
    obj: Partial<Location> = {},
    sort_params: LocationSortByInput = {
        attribute: LocationSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit: number = 10
): Promise<LocationResponse> {
    let r: LocationResponse = {};
    await this.knex<Location>('locations_enhanced')
        .select('*')
        .where(obj)
        .orderByRaw(
            "locations_enhanced.geog <-> 'POINT(" +
                locationResult.geometry.location.lng +
                ' ' +
                locationResult.geometry.location.lat +
                ")'::geometry"
        )
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .limit(limit)
        .then((locations) => {
            r.locations = assembleLocation(locations);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

export async function getLocationsGeneric(
    this: postgresHandler,
    obj: Partial<Location> = {},
    sort_params: LocationSortByInput = {
        attribute: LocationSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit: number = 10
): Promise<LocationResponse> {
    let r: LocationResponse = {};
    await this.knex<Location>('locations_enhanced')
        .select('*')
        .where(obj)
        .limit(limit)
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .then((locations) => {
            r.locations = assembleLocation(locations);
        })
        .catch(
            (e) =>
                (r.errors = [
                    { field: 'query residence', message: e.toString() },
                ])
        );
    return r;
}

export async function getLocationsBoundingBox(
    this: postgresHandler,
    perimeter: GeoBoundaryInput,
    filter: PartialLocation = {},
    sort_params: LocationSortByInput = {
        attribute: LocationSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit: number = 10
): Promise<LocationResponse> {
    let r: LocationResponse = {};

    await this.knex('locations_enhanced')
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
        .then((locations) => {
            r.locations = assembleLocation(locations);
        })
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

// return loc_id or null
export async function locationExists(
    this: postgresHandler,
    place_id: string
): Promise<number | null> {
    var r: number | null = null;
    await this.knex('locations_enhanced')
        .select('loc_id')
        .where({ google_place_id: place_id })
        .then((ids) => {
            if (ids.length == 0) {
                r = null;
            } else {
                r = ids[0].loc_id;
            }
        })
        .catch(() => {
            r = null;
        });

    return r;
}
