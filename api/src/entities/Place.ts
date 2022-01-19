import { Entity, Property, Enum, Collection, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceType } from '../utils/enums/PlaceType.enum';
import { PlaceValidator } from '../validators/PlaceValidator';

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @Field()
    @Property()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residences = new Collection<Residence>(this);

    @Field(() => PlaceType)
    @Enum(() => PlaceType)
    public type: PlaceType;

    constructor(body: PlaceValidator) {
        super(body);
    }
}
