import {
    Cascade,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { Review } from './Review';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { ResidenceValidator } from '../validators/ResidenceValidator';
import { Place } from './Place';

@ObjectType()
@Entity()
export class Residence extends Base<Residence> {
    @Field({ defaultValue: 'single' })
    @Property({ default: 'single' })
    public unit: string;

    @Field(() => [Review])
    @OneToMany(() => Review, (r: Review) => r.residence)
    public reviews = new Collection<Review>(this);

    @Field(() => Place)
    @ManyToOne(() => Place, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public place: Place;

    constructor(body: ResidenceValidator) {
        super(body);
    }
}
