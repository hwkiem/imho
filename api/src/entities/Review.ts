import {
    Cascade,
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    Property,
} from '@mikro-orm/core';
import ReviewValidator from 'src/validators/review.validator';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';

@ObjectType()
@Entity()
export class Review extends Base<Review> {
    @Field()
    @Property()
    public feedback: string;

    @Field(() => Residence, { nullable: true })
    @ManyToOne(() => Residence, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public residence: Residence;

    constructor(body: ReviewValidator) {
        super(body);
    }
}
