import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';

import { ReviewValidator } from '../validators/ReviewValidator';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import Flag from '../utils/types/Flag';
// import { ApiResponse } from './Response';

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

    @Field(() => [Flag])
    flags: Flag[];

    constructor(body: ReviewValidator) {
        super(body);
    }
}
