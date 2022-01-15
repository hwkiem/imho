import { LocationType } from '../enums/LocationType.enum';
import { IsString, IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class LocationValidator {
    @Field()
    @IsString()
    public google_place_id: string;

    @Field(() => LocationType)
    @IsEnum(LocationType)
    public type: LocationType;
}

export default LocationValidator;
