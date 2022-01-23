import {
    Entity,
    Property,
    Enum,
    Collection,
    OneToMany,
    Unique,
} from '@mikro-orm/core';
import { Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceType } from '../utils/enums/PlaceType.enum';
import { PlaceValidator } from '../validators/PlaceValidator';
import { MyContext } from '../utils/context';
import { EntityManager, PostgreSqlConnection } from '@mikro-orm/postgresql';

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residenceCollection = new Collection<Residence>(this);

    @Field()
    @Property()
    @Unique()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    async residences(
        @Root() place: Place
    ): Promise<Collection<Residence> | null> {
        if (place.residenceCollection.isInitialized()) {
            return place.residenceCollection;
        } else {
            console.log('[residences] initializing residences...');
            await place.residenceCollection.init();
            return place.residenceCollection;
        }
    }

    @Field(() => Float, { nullable: true })
    async averageRating(
        @Root() place: Place,
        @Ctx() { em }: MyContext
    ): Promise<number | null> {
        const knex = (
            (em as EntityManager).getConnection() as PostgreSqlConnection
        ).getKnex();

        const res = await knex
            .avg('rating')
            .from('review')
            .where(
                'review.residence_id',
                'in',
                knex
                    .select('id')
                    .from('residence')
                    .where('place_id', '=', place.id)
            );

        if (!res[0].avg) return null;
        return +res[0].avg;
    }

    @Field(() => PlaceType)
    @Enum(() => PlaceType)
    public type: PlaceType;

    constructor(body: PlaceValidator) {
        super(body);
    }
}
