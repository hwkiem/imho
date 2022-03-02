import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { ReviewValidator } from '../validators/ReviewValidator';
import { Field, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { Flags } from '../utils/types/Flag';
import { ImhoUser } from './ImhoUser';
@ObjectType()
@Entity()
@Unique({ properties: ['author', 'residence'] })
export class Review extends Base<Review> {
    @ManyToOne(() => Residence, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public residence: Residence;

    /**
     * Residence this review is about
     */
    @Field(() => Residence)
    async myResidence(@Root() review: Review): Promise<Residence | null> {
        if (!review.residence.isInitialized()) {
            await review.residence.init();
        }
        return review.residence;
    }

    @ManyToOne(() => ImhoUser, { nullable: true })
    public author: ImhoUser | null;

    /**
     * User who wrote this review
     */
    @Field(() => ImhoUser, { nullable: true })
    async myAuthor(@Root() review: Review): Promise<ImhoUser | null> {
        if (review.author === null) return null;
        if (!review.author.isInitialized()) {
            await review.author.init();
        }
        return review.author;
    }

    /* Properties */
    @Field({ nullable: true })
    @Property({ nullable: true })
    public feedback: string;

    @Field()
    @Property()
    public rating: number;

    @Property()
    flag_string: string;

    /**
     * The pros, cons and dbks assigned in this review
     */
    @Field(() => Flags, { nullable: true })
    flags(@Root() review: Review): Flags | undefined {
        return review.flag_string ? JSON.parse(review.flag_string) : undefined;
    }

    constructor(body: ReviewValidator) {
        super(body);
    }
}
