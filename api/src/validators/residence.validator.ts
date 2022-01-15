import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class ResidenceValidator {
    @Field()
    @IsString()
    public unit: string;
}

export default ResidenceValidator;
