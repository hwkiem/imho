import { PlaceType } from '../utils/enums/PlaceType.enum';
import { IsString, IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Place } from '../entities/Place';

export class PlaceValidator implements Partial<Place> {
    @IsString()
    public google_place_id: string;

    @IsString()
    formatted_address: string;

    @IsEnum(PlaceType)
    public type: PlaceType;
}

@InputType()
export class CreatePlaceInput extends PlaceValidator {
    @Field()
    public google_place_id: string;

    @Field()
    formatted_address: string;

    @Field(() => PlaceType)
    public type: PlaceType;
}
