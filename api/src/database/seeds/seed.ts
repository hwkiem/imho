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
            google_place_id:
                'EioxMiBXIDEwNHRoIFN0ICMzZSwgTmV3IFlvcmssIE5ZIDEwMDI1LCBVU0EiHhocChYKFAoSCXmD2y4i9sKJEeQeYveWll2lEgIzZQ',
            full_address: '12 W 104th St #3e, New York, NY 10025, USA',
            apt_num: '3e',
            street_num: '12',
            route: 'West 104th Street',
            city: 'New York',
            state: 'New York',
            postal_code: '10025',
            geog: knexPostgis.geographyFromText(
                'Point(' + 40.7969087 + ' ' + -73.96190469999999 + ')'
            ),
        },
        {
            google_place_id:
                'EisyMTUgVyAxMDh0aCBTdCAjMmIsIE5ldyBZb3JrLCBOWSAxMDAyNSwgVVNBIh4aHAoWChQKEgl_yZdWO_bCiRGVBO8JPah21BICMmI',
            full_address: '215 W 108th St #2b, New York, NY 10025, USA',
            apt_num: '2b',
            street_num: '215',
            route: 'West 108th Street',
            city: 'New York',
            state: 'New York',
            postal_code: '10025',
            geog: knexPostgis.geographyFromText(
                'Point(' + 40.80236499999999 + ' ' + -73.9656429 + ')'
            ),
        },
        {
            google_place_id:
                'Ei43MzQgQW1zdGVyZGFtIEF2ZSAjNmgsIE5ldyBZb3JrLCBOWSAxMDAyNSwgVVNBIh4aHAoWChQKEgnzXGvnJ_bCiRHhgo26YWXF6BICNmg',
            full_address: '734 Amsterdam Ave #6h, New York, NY 10025, USA',
            apt_num: '6h',
            street_num: '734',
            route: 'Amsterdam Avenue',
            city: 'New York',
            state: 'New York',
            postal_code: '10025',
            geog: knexPostgis.geographyFromText(
                'Point(' + 40.7940122 + ' ' + -73.9707385 + ')'
            ),
        },
        {
            google_place_id: 'ChIJITunjlZ7wokRAT22KTdm2a0',
            full_address: '17 Roosevelt Pl, Rockville Centre, NY 11570, USA',
            street_num: '17',
            route: 'Roosevelt Place',
            city: 'Rockville Centre',
            state: 'New York',
            postal_code: '11570',
            geog: knexPostgis.geographyFromText(
                'Point(' + 40.6644586 + ' ' + -73.6466074 + ')'
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
