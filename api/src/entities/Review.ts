import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { ReviewValidator } from '../validators/ReviewValidator';
import { Field, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { Flags } from '../utils/types/Flag';
import { ImhoUser } from './ImhoUser';
@Unique({ properties: ['author', 'residence'] })
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

    @Property()
    flag_string: string;

    @Field(() => Flags, { nullable: true })
    flags(@Root() review: Review): Flags | undefined {
        return review.flag_string ? JSON.parse(review.flag_string) : undefined;
    }

    public flagInput: Flags;

    constructor(body: ReviewValidator) {
        super(body);
        this.flag_string = JSON.stringify(this.flags);
    }
}
