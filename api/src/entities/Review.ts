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
    public author: ImhoUser | undefined;

    /**
     * User who wrote this review
     */
    @Field(() => ImhoUser, { nullable: true })
    async myAuthor(@Root() review: Review): Promise<ImhoUser | null> {
        // can be undefined when creating object but will be null when fetching ...
        if (review.author === undefined || review.author === null) return null;
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

    @Field(() => Flags, { nullable: true })
    @Property({ type: 'json', nullable: true })
    public flags?: Flags;

    constructor(body: ReviewValidator) {
        super(body);

        // make sure unique flags
        if (this.flags) {
            this.flags = {
                pros: {
                    bathroom: this.flags.pros.bathroom
                        ? [...new Set(this.flags.pros.bathroom)]
                        : undefined,
                    kitchen: this.flags.pros.kitchen
                        ? [...new Set(this.flags.pros.kitchen)]
                        : undefined,
                    landlord: this.flags.pros.landlord
                        ? [...new Set(this.flags.pros.landlord)]
                        : undefined,
                    location: this.flags.pros.location
                        ? [...new Set(this.flags.pros.location)]
                        : undefined,
                    misc: this.flags.pros.misc
                        ? [...new Set(this.flags.pros.misc)]
                        : undefined,
                },
                cons: {
                    bathroom: this.flags.cons.bathroom
                        ? [...new Set(this.flags.cons.bathroom)]
                        : undefined,
                    landlord: this.flags.cons.landlord
                        ? [...new Set(this.flags.cons.landlord)]
                        : undefined,
                    location: this.flags.cons.location
                        ? [...new Set(this.flags.cons.location)]
                        : undefined,
                    maintenance: this.flags.cons.maintenance
                        ? [...new Set(this.flags.cons.maintenance)]
                        : undefined,
                    smells: this.flags.cons.smells
                        ? [...new Set(this.flags.cons.smells)]
                        : undefined,
                    utilities: this.flags.cons.utilities
                        ? [...new Set(this.flags.cons.utilities)]
                        : undefined,
                    misc: this.flags.pros.misc
                        ? [...new Set(this.flags.cons.misc)]
                        : undefined,
                },
            };
        }
    }
}
