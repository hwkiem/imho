import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Residence } from '../entities/Residence';

@InputType()
export class ResidenceValidator implements Partial<Residence> {
    @Field()
    @IsString()
    public unit: string;
}
