import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { ReviewValidator } from '../validators/ReviewValidator';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { Flags } from '../utils/types/Flag';
import { ImhoUser } from './ImhoUser';

@ObjectType()
@Entity()
export class Review extends Base<Review> {
    @Field({ nullable: true })
    @Property({ nullable: true })
    public feedback: string;

    @Field()
    @Property()
    public rating: number;

    @Field(() => Residence, { nullable: true })
    @ManyToOne(() => Residence, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public residence: Residence;

    @Field(() => ImhoUser, { nullable: true })
    @ManyToOne(() => ImhoUser, { nullable: true })
    public author: ImhoUser;

    @Field(() => Flags)
    flags: Flags;

    @Property()
    flag_string: string;

    constructor(body: ReviewValidator) {
        super(body);
        this.flag_string = JSON.stringify(this.flags);
    }
}
