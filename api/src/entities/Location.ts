import {
    Cascade,
    Entity,
    ManyToOne,
    Property,
    Enum,
    Collection,
    OneToMany,
} from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { LocationType } from 'src/enums/LocationType.enum';
import LocationValidator from 'src/validators/location.validator';

@ObjectType()
@Entity()
export class Location extends Base<Location> {
    @Field()
    @Property()
    public google_place_id: string;

    @Field(() => Location, { nullable: true })
    @ManyToOne(() => Location, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public residences: Residence;

    @Field(() => [Residence])
    @OneToMany(() => Residence, (r: Residence) => r.location)
    public residence = new Collection<Residence>(this);

    @Field(() => LocationType)
    @Enum(() => LocationType)
    public type: LocationType;

    constructor(body: LocationValidator) {
        super(body);
    }
}
