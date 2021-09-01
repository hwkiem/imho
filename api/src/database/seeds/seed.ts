import * as Knex from 'knex';
import { Residence } from '../../Residence/residence';
import { Review } from '../../Review/reviews';
import { User } from '../../User/user';
import KnexPostgis from 'knex-postgis';
import knexConfig from '../knexfile';

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

    await knex<Residence>('residences').insert([
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
            google_place_id:
                'Eik2MTQgU3ljYW1vcmUgTG4gIzFhLCBEYXZpcywgQ0EgOTU2MTYsIFVTQSIeGhwKFgoUChIJYxBDa6wphYARlcQYVmKInAwSAjFh',
            full_address: '614 Sycamore Ln #1a, Davis, CA 95616, USA',
            apt_num: '1a',
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
            google_place_id:
                'Eio5MjAgQ3JhbmJyb29rIEN0ICMzZiwgRGF2aXMsIENBIDk1NjE2LCBVU0EiHhocChYKFAoSCXugiI6XKYWAEcRojVAXUfgbEgIzZg',
            full_address: '920 Cranbrook Ct #3f, Davis, CA 95616, USA',
            apt_num: '3f',
            street_num: '920',
            route: 'Cranbrook Court',
            city: 'Davis',
            state: 'California',
            postal_code: '95616',
            geog: knexPostgis.geographyFromText(
                'Point(' + -121.7405625 + ' ' + 38.5585907 + ')'
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
                'Point(' + -121.7551427 + ' ' + 38.5560044 + ')'
            ),
        },
    ]);

    const userStart = (await knex.raw('select min(user_id) from users')).rows[0]
        .min;
    const resStart = (await knex.raw('select min(res_id) from residences'))
        .rows[0].min;

    await knex<Review>('reviews').insert([
        { user_id: userStart, res_id: resStart, rent: 4000, rating: 5 },
        { user_id: userStart + 1, res_id: resStart, rent: 4200, rating: 4 },
        { user_id: userStart + 1, res_id: resStart + 1 },
        {
            user_id: userStart + 2,
            res_id: resStart + 2,
            rent: 10000,
            rating: 2,
        },
        { user_id: userStart + 3, res_id: resStart + 3, rent: 1000, rating: 3 },
        { user_id: userStart + 4, res_id: resStart + 3, rent: 2500, rating: 3 },
    ]);
}
