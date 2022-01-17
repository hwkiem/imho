import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';

import { ReviewValidator } from '../validators/ReviewValidator';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { Flag } from '../utils/types/Flag';
import { FlagTypes } from '../utils/enums/FlagType.enum';
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

    @Property()
    flag_string: Array<number> = new Array(Object.values(FlagTypes).length);

    constructor(body: ReviewValidator) {
        super(body);
        const topicsMap = body.flags.map((f) => f.topic);

        Object.values(FlagTypes).map((v, idx) => {
            if (topicsMap.includes(v)) {
                this.flag_string[idx] = 1;
            } else {
                this.flag_string[idx] = 0;
            }
        });
    }
}
