import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Place } from '../entities/Place';

export class PlaceValidator implements Partial<Place> {
    @IsString()
    public google_place_id: string;

    @IsString()
    formatted_address: string;
}

@InputType()
export class CreatePlaceInput extends PlaceValidator {
    @Field()
    public google_place_id: string;

    @Field()
    formatted_address: string;
}
