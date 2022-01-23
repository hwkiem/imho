import {
    Entity,
    Property,
    Collection,
    OneToMany,
    Unique,
} from '@mikro-orm/core';
import { Field, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Review } from './Review';
import { PendingUserInput, UserValidator } from '../validators/UserValidator';

@ObjectType()
@Entity()
export class ImhoUser extends Base<ImhoUser> {
    @OneToMany(() => Review, (r: Review) => r.author)
    public reviewCollection = new Collection<Review>(this);

    @Field()
    @Property()
    @Unique()
    public email: string;

    @Property({ nullable: true })
    public password: string;

    @Property()
    public isActivated: boolean;

    @Field(() => [Review])
    async reviews(@Root() user: ImhoUser): Promise<Collection<Review> | null> {
        if (user.reviewCollection.isInitialized()) {
            return user.reviewCollection;
        } else {
            console.log('[residences] initializing residences...');
            await user.reviewCollection.init();
            return user.reviewCollection;
        }
    }

    constructor(body: UserValidator | PendingUserInput) {
        super(body);
    }
}
