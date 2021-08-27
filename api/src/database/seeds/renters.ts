import * as Knex from 'knex';
import { UserGQL } from '../../User/user';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('users').del();
    await knex('residences').del();
    await knex('reviews').del();

    // Inserts seed entries
    // await knex<UserGQL>('users').insert([
    //     {
    //         email: 'a@gmail.com',
    //         first_name: 'James',
    //         last_name: 'Pater',
    //         password: 'passssss',
    //     },
    //     {
    //         email: 'james@gmail.com',
    //         first_name: 'Hwk',
    //         last_name: 'Ryan',
    //         password: 'pooppoop',
    //     },
    // ]);
    await knex<UserGQL>('users')
        .insert({
            email: 'james@gmail.com',
            first_name: 'Hwk',
            last_name: 'Ryan',
            password:
                '$argon2i$v=19$m=4096,t=3,p=1$G3+YDAFohgs+NB1g4q2KNw$vp5/zIsQ5sL7/PVjDjx1JTKtrVIdznX2EFlVLzKxNSs',
        })
        .returning('*')
        .then((users) => console.log(users))
        .catch((e) => {
            // if (e.code === '23505') {
            //     console.log([{ message: 'email taken', field: 'email' }]);
            // }
            console.log([{ message: e, field: 'email' }]);
        });
}
