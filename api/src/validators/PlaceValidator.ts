import { PlaceType } from '../utils/enums/PlaceType.enum';
import { IsString, IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Place } from '../entities/Place';

@InputType()
export class PlaceValidator implements Partial<Place> {
    @Field()
    @IsString()
    public google_place_id: string;

    @Field()
    @IsString()
    formatted_address: string;

    @Field(() => PlaceType)
    @IsEnum(PlaceType)
    public type: PlaceType;
}
