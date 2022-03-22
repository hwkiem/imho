import { IsDivisibleBy, IsNumber, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Review } from '../entities/Review';
import { Flags } from '../utils/types/Flag';

export class ReviewValidator implements Partial<Review> {
    @IsString()
    public feedback: string;

    @IsNumber()
    @IsDivisibleBy(25)
    @Min(0)
    @Max(100)
    public rating: number;
}

@InputType()
export class CreateReviewInput extends ReviewValidator {
    @Field()
    public feedback: string;

    @Field()
    public rating: number;

    @Field(() => Flags)
    public flagInput: Flags;

    constructor() {
        super();
        // make sure unique flags
        if (this.flagInput) {
            this.flagInput = {
                pros: {
                    bathroom: this.flagInput.pros.bathroom
                        ? [...new Set(this.flagInput.pros.bathroom)]
                        : undefined,
                    kitchen: this.flagInput.pros.kitchen
                        ? [...new Set(this.flagInput.pros.kitchen)]
                        : undefined,
                    landlord: this.flagInput.pros.landlord
                        ? [...new Set(this.flagInput.pros.landlord)]
                        : undefined,
                    location: this.flagInput.pros.location
                        ? [...new Set(this.flagInput.pros.location)]
                        : undefined,
                    misc: this.flagInput.pros.misc
                        ? [...new Set(this.flagInput.pros.misc)]
                        : undefined,
                },
                cons: {
                    bathroom: this.flagInput.cons.bathroom
                        ? [...new Set(this.flagInput.cons.bathroom)]
                        : undefined,
                    landlord: this.flagInput.cons.landlord
                        ? [...new Set(this.flagInput.cons.landlord)]
                        : undefined,
                    location: this.flagInput.cons.location
                        ? [...new Set(this.flagInput.cons.location)]
                        : undefined,
                    maintenance: this.flagInput.cons.maintenance
                        ? [...new Set(this.flagInput.cons.maintenance)]
                        : undefined,
                    smells: this.flagInput.cons.smells
                        ? [...new Set(this.flagInput.cons.smells)]
                        : undefined,
                    utilities: this.flagInput.cons.utilities
                        ? [...new Set(this.flagInput.cons.utilities)]
                        : undefined,
                    misc: this.flagInput.pros.misc
                        ? [...new Set(this.flagInput.cons.misc)]
                        : undefined,
                },
            };
        }
    }
}
