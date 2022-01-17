import { Entity, Property, Enum, Collection, OneToMany } from '@mikro-orm/core';
import { Arg, Field, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceType } from '../utils/enums/PlaceType.enum';
import { PlaceValidator } from '../validators/PlaceValidator';
import { Flag } from '../utils/types/Flag';
import { FlagTypes } from '../utils/enums/FlagType.enum';

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @Field()
    @Property()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residences = new Collection<Residence>(this);

    @Field(() => PlaceType)
    @Enum(() => PlaceType)
    public type: PlaceType;

    // Field resolver and some sort of validation on topFlags length
    @Field(() => [Flag], { nullable: true })
    async topNFlags(
        @Root() place: Place,
        @Arg('n') n: number
    ): Promise<Flag[]> {
        let flagSums = new Array<number>(Object.values(FlagTypes).length).fill(
            0
        );

        for (const residence of place.residences) {
            for (const review of residence.reviews) {
                flagSums = flagSums.map(
                    (num, idx) => num + review.flag_string[idx]
                );
            }
        }

        const res = new Array<Flag>();

        console.log('FLAGSUMS');
        console.log(flagSums);

        for (let i = 0; i < n; i++) {
            const maxIdx = flagSums.indexOf(Math.max(...flagSums));
            const fg = Object.values(FlagTypes).at(maxIdx);
            if (fg) {
                res.push({ topic: fg });
            }
            flagSums[maxIdx] = 0;
        }

        return res;
    }

    constructor(body: PlaceValidator) {
        super(body);
    }
}
