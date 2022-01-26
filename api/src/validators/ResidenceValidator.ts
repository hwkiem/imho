import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Residence } from '../entities/Residence';

export class ResidenceValidator implements Partial<Residence> {
    @IsString()
    @IsOptional()
    public unit?: string;
}

@InputType()
export class CreateResidenceInput extends ResidenceValidator {
    @Field({ nullable: true })
    public unit?: string;
}
