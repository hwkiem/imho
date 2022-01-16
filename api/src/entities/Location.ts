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
import { Flag } from './Review';

@ObjectType()
@Entity()
export class Location extends Base<Location> {
    @Field()
    @Property()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    @OneToMany(() => Residence, (r: Residence) => r.location)
    public residences = new Collection<Residence>(this);

    @Field(() => LocationType)
    @Enum(() => LocationType)
    public type: LocationType;

    // Field resolver and some sort of validation on topFlags length
    @Field(() => [Flag])
    topFlags: Flag[];

    constructor(body: LocationValidator) {
        super(body);
    }
}
