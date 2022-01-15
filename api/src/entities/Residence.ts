import {
    Cascade,
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Property,
    Enum,
} from '@mikro-orm/core';
import { Review } from './Review';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import ResidenceValidator from 'src/validators/residence.validator';

@ObjectType()
@Entity()
export class Residence extends Base<Residence> {
    @Field()
    @Property()
    public unit: string;

    @Field(() => [Review])
    @OneToMany(() => Review, (r: Review) => r.residence)
    public reviews = new Collection<Review>(this);

    @Field(() => Location)
    @ManyToOne(() => Location, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public location: Location;

    constructor(body: ResidenceValidator) {
        super(body);
    }
}
