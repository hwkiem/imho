import 'reflect-metadata';
import * as Knex from 'knex';
import { Residence } from '../../Residence/Residence';
import { Review } from '../../Review/Review';
import { User } from '../../User/User';
import KnexPostgis from 'knex-postgis';
import knexConfig from '../knexfile';
import { StoveType } from '../../types/enum_types';

const knex = new Knex.Client(knexConfig);
const knexPostgis = KnexPostgis(knex);

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('reviews').del();
    await knex('users').del();
    await knex('residences').del();

    // every password is cenacena
    await knex<User>('users').insert([
        {
            email: 'james@gmail.com',
            first_name: 'Jim',
            last_name: 'Ryan',
            password:
                '$argon2i$v=19$m=4096,t=3,p=1$dJSjQSsrWmtM4fxgownjAg$ZndCchbjbDkiSghDNFFM7BHWYovC73ZzQpsmCUAT7Ws',
        },
        {
            email: 'another@gmail.com',
            first_name: 'John',
            last_name: 'Keem',
            password:
                '$argon2i$v=19$m=4096,t=3,p=1$dJSjQSsrWmtM4fxgownjAg$ZndCchbjbDkiSghDNFFM7BHWYovC73ZzQpsmCUAT7Ws',
        },
        {
            email: 'myemail@gmail.com',
            first_name: 'Jane',
            last_name: 'Boon',
            password:
                '$argon2i$v=19$m=4096,t=3,p=1$dJSjQSsrWmtM4fxgownjAg$ZndCchbjbDkiSghDNFFM7BHWYovC73ZzQpsmCUAT7Ws',
        },
        {
            email: 'lastdance@gmail.com',
            first_name: 'Drew',
            last_name: 'Drue',
            password:
                '$argon2i$v=19$m=4096,t=3,p=1$dJSjQSsrWmtM4fxgownjAg$ZndCchbjbDkiSghDNFFM7BHWYovC73ZzQpsmCUAT7Ws',
        },
        {
            email: 'creative@gmail.com',
            first_name: 'Filler',
            last_name: 'Connors',
            password:
                '$argon2i$v=19$m=4096,t=3,p=1$dJSjQSsrWmtM4fxgownjAg$ZndCchbjbDkiSghDNFFM7BHWYovC73ZzQpsmCUAT7Ws',
        },
    ]);

    await knex<Location>('locations').insert([
        {
            google_place_id: 'ChIJA7uBlJcphYAR79QB8w6fAVg',
            full_address: '920 Cranbrook Court, Davis, CA 95616, USA',
            street_num: '920',
            route: 'Cranbrook Court',
            city: 'Davis',
            state: 'California',
            postal_code: '95616',
            geog: knexPostgis.geographyFromText(
                'Point(' + -121.7407628 + ' ' + 38.5591035 + ')'
            ),
        },
        {
            google_place_id: 'ChIJ5z8sO3gphYARfxI717FQgtI',
            full_address: '1737 Pomona Dr, Davis, CA 95616, USA',
            street_num: '1737',
            route: 'Pomona Drive',
            city: 'Davis',
            state: 'California',
            postal_code: '95616',
            geog: knexPostgis.geographyFromText(
                'Point(' + -121.7302551 + ' ' + 38.5503238 + ')'
            ),
        },
        {
            google_place_id: 'ChIJC4XVZawphYAR9STg547WSeQ',
            full_address: '614 Sycamore Ln, Davis, CA 95616, USA',
            street_num: '614',
            route: 'Sycamore Lane',
            city: 'Davis',
            state: 'California',
            postal_code: '95616',
            geog: knexPostgis.geographyFromText(
                'Point(' + -121.7609074 + ' ' + 38.5483489 + ')'
            ),
        },
        {
            google_place_id: 'ChIJa4E1i7AphYAROy3Ai_nYWhA',
            full_address: '539 Villanova Dr, Davis, CA 95616, USA',
            street_num: '539',
            route: 'Villanova Drive',
            city: 'Davis',
            state: 'California',
            postal_code: '95616',
            geog: knexPostgis.geographyFromText(
                'Point(' + -121.7551427 + ' ' + 38.5564679 + ')'
            ),
        },
        {
            google_place_id: 'ChIJfX6HAbEphYARBl5uwq5ksYQ',
            full_address: '606 Villanova Dr, Davis, CA 95616, USA',
            street_num: '606',
            route: 'Villanova Drive',
            city: 'Davis',
            state: 'California',
            postal_code: '95616',
            geog: knexPostgis.geographyFromText(
                'Point(' + -121.7567452 + ' ' + 38.5560953 + ')'
            ),
        },
    ]);

    const loc_start = (await knex.raw('select min(loc_id) from locations'))
        .rows[0].min;

    await knex<Residence>('residences').insert([
        { unit: '2f', loc_id: loc_start },
        { unit: '1a', loc_id: loc_start },
        { unit: '5c', loc_id: loc_start },
        { unit: '1', loc_id: loc_start + 1 },
        { unit: '1', loc_id: loc_start + 2 },
        { unit: '1', loc_id: loc_start + 3 },
    ]);

    const userStart = (await knex.raw('select min(user_id) from users')).rows[0]
        .min;
    const resStart = (await knex.raw('select min(res_id) from residences'))
        .rows[0].min;

    // var Range = require('pg-range').Range;

    await knex<Review>('reviews').insert([
        // 1
        {
            user_id: userStart,
            res_id: resStart,
            rent: 4000,
            rating: 2,
            air_conditioning: true,
            bath_count: 1.5,
            bedroom_count: 2,
            parking: false,
            doorman: false,
            lease_term: require('pg-range').Range(
                new Date('January 2019'),
                new Date('January 2020')
            ),
        },
        {
            user_id: userStart + 1,
            res_id: resStart,
            rent: 2500,
            rating: 5,
            air_conditioning: true,
            bath_count: 1.5,
            bedroom_count: 2,
            parking: false,
            doorman: false,
            pet_friendly: false,
            lease_term: require('pg-range').Range(
                new Date('January 2017'),
                new Date('March 2018')
            ),
        },
        // 2
        {
            user_id: userStart + 2,
            res_id: resStart + 1,
            rent: 3000,
            rating: 4,
            air_conditioning: true,
            bath_count: 1,
            bedroom_count: 1,
            pet_friendly: false,
            heat: true,
            stove: StoveType.ELECTRIC,
            lease_term: require('pg-range').Range(
                new Date('January 2016'),
                new Date('January 2017')
            ),
        },
        {
            user_id: userStart,
            res_id: resStart + 1,
            rent: 2700,
            rating: 5,
            air_conditioning: true,
            bath_count: 1,
            bedroom_count: 1,
            pet_friendly: false,
            heat: true,
            stove: StoveType.ELECTRIC,
            parking: true,
            lease_term: require('pg-range').Range(
                new Date('January 2015'),
                new Date('January 2016')
            ),
        },
        // 3
        {
            user_id: userStart + 4,
            res_id: resStart + 2,
            rent: 4000,
            rating: 5,
            air_conditioning: true,
            heat: true,
            stove: StoveType.ELECTRIC,
            parking: true,
            dishwasher: true,
            gym: true,
            lease_term: require('pg-range').Range(
                new Date('December 2017'),
                new Date('May 2020')
            ),
        },
        // 4
        {
            user_id: userStart + 2,
            res_id: resStart + 3,
            rent: 6000,
            rating: 5,
            air_conditioning: true,
            bath_count: 2,
            bedroom_count: 2,
            parking: false,
            doorman: false,
            lease_term: require('pg-range').Range(
                new Date('September 2020'),
                new Date('June 2021')
            ),
        },
        // 5
        {
            user_id: userStart + 1,
            res_id: resStart + 4,
            rent: 10000,
            rating: 3,
            air_conditioning: false,
            heat: false,
            stove: StoveType.GAS,
            parking: true,
            dishwasher: true,
            gym: true,
            lease_term: require('pg-range').Range(
                new Date('April 2018'),
                new Date('January 2020')
            ),
        },
        // 6
        {
            user_id: userStart + 3,
            res_id: resStart + 5,
            rent: 4000,
            rating: 5,
            air_conditioning: true,
            heat: true,
            stove: StoveType.ELECTRIC,
            parking: true,
            dishwasher: true,
            gym: true,
            lease_term: require('pg-range').Range(
                new Date('March 2017'),
                new Date('June 2019')
            ),
        },
    ]);
}
