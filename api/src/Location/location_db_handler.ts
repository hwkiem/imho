import { postgresHandler } from '../dataSources/postgres';
import { LocationSortBy, QueryOrderChoice } from '../types/enum_types';
import {
    GeoBoundaryInput,
    LocationSortByInput,
    PartialLocation,
} from '../types/input_types';
import {
    FieldError,
    LocationResponse,
    SingleLocationResponse,
} from '../types/object_types';
import { assembleLocation } from '../utils/db_helper';
import { unpackLocation } from '../utils/mapUtils';
import { Location } from './Location';
import { Container } from 'typedi';
import { googleMapsHandler } from '../dataSources/mapsAPI';

export async function createLocation(
    this: postgresHandler,
    google_place_id: string
): Promise<SingleLocationResponse> {
    // obtain and validate location from place_id
    const maps = Container.get(googleMapsHandler);
    const geocode = await maps.locationFromPlaceID(google_place_id);
    if (geocode instanceof FieldError) return { errors: [geocode] };

    const args = {
        google_place_id,
        ...unpackLocation(geocode),
        geog: this.knexPostgis.geographyFromText(
            'Point(' +
                geocode.geometry.location.lng +
                ' ' +
                geocode.geometry.location.lat +
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

    const r: SingleLocationResponse = {};
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
    const r: LocationResponse = {};
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

export async function getSingleLocationById(
    this: postgresHandler,
    ids: number[]
): Promise<SingleLocationResponse> {
    const r: SingleLocationResponse = {};
    await this.knex<Location>('locations_enhanced')
        .select('*')
        .where('loc_id', 'in', ids)
        .limit(1)
        .then((locations) => {
            r.location = assembleLocation(locations)[0];
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
    place_id: string,
    obj: Partial<Location> = {},
    sort_params: LocationSortByInput = {
        attribute: LocationSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit = 10
): Promise<LocationResponse> {
    const maps = Container.get(googleMapsHandler);
    const geocode = await maps.locationFromPlaceID(place_id);
    if (geocode instanceof FieldError) return { errors: [geocode] };

    const r: LocationResponse = {};
    await this.knex<Location>('locations_enhanced')
        .select('*')
        .where(obj)
        .orderByRaw(
            "locations_enhanced.geog <-> 'POINT(" +
                geocode.geometry.location.lng +
                ' ' +
                geocode.geometry.location.lat +
                ")'::geometry"
        )
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .limit(limit)
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

export async function getLocationsGeneric(
    this: postgresHandler,
    obj: Partial<Location> = {},
    sort_params: LocationSortByInput = {
        attribute: LocationSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit = 10
): Promise<LocationResponse> {
    const r: LocationResponse = {};
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
    limit = 10
): Promise<LocationResponse> {
    const r: LocationResponse = {};

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
            (e) =>
                (r.errors = [
                    { field: 'query location', message: e.toString() },
                ])
        );
    return r;
}

// returns loc_id if exists
export async function locationExists(
    this: postgresHandler,
    place_id: string
): Promise<number | null> {
    let r: number | null = null;
    await this.knex('locations')
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

export async function createLocationIfNotExists(
    this: postgresHandler,
    place_id: string
): Promise<number | FieldError> {
    const locId = await this.locationExists(place_id);
    // does location exist
    if (locId === null) {
        // create one
        const res = await this.createLocation(place_id);
        if (res.errors) return res.errors[0];
        if (res.location) return res.location.loc_id;
        return { field: 'create location', message: 'empty response' };
    } else {
        return locId;
    }
}
