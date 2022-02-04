import {
    Entity,
    Property,
    Collection,
    OneToMany,
    Unique,
    ManyToMany,
} from '@mikro-orm/core';
import { Field, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Review } from './Review';
import { UserValidator } from '../validators/UserValidator';
import { Place } from './Place';

@ObjectType()
@Entity()
export class ImhoUser extends Base<ImhoUser> {
    @OneToMany(() => Review, (r: Review) => r.author)
    public reviewCollection = new Collection<Review>(this);

    @ManyToMany(() => Place, (p: Place) => p.notifyOnReview)
    public notifyMeAbout = new Collection<Place>(this);

    @Field()
    @Property()
    @Unique()
    public email: string;

    @Property({ nullable: true })
    public password?: string;

    @Property()
    public isActivated: boolean;

    @Field(() => [Place])
    async myTrackedPlaces(
        @Root() user: ImhoUser
    ): Promise<Collection<Place> | null> {
        if (!user.notifyMeAbout.isInitialized()) {
            await user.notifyMeAbout.init();
        }
        return user.notifyMeAbout;
    }

    @Field(() => [Review])
    async reviews(@Root() user: ImhoUser): Promise<Collection<Review> | null> {
        if (!user.reviewCollection.isInitialized()) {
            await user.reviewCollection.init();
        }
        return user.reviewCollection;
    }

    constructor(body: UserValidator) {
        super(body);
    }
}
