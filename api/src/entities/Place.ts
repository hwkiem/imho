import { Entity, Property, Enum, Collection, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceType } from '../utils/enums/PlaceType.enum';
import { PlaceValidator } from '../validators/PlaceValidator';
import { Flags } from '../utils/types/Flag';

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
    @Field(() => Flags, { nullable: true })
    async topNFlags(@Root() place: Place): Promise<Flags> {
        const counter: { [key: string]: number } = {};
        for (const residence of place.residences) {
            for (const review of residence.reviews) {
                const flags = review.flags;
                if (flags.pros) {
                    for (const f of flags.pros) {
                        counter[f] = counter[f] + 1;
                    }
                }
                if (flags.cons) {
                    for (const f of flags.cons) {
                        counter[f] = counter[f] + 1;
                    }
                }
                if (flags.dbks) {
                    for (const f of flags.dbks) {
                        counter[f] = counter[f] + 1;
                    }
                }
            }
        }
        console.log(counter);
        return { pros: [], cons: [], dbks: [] };
    }

    constructor(body: PlaceValidator) {
        super(body);
    }
}
