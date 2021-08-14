import { ObjectType, Field, Float } from "type-graphql";
import { Residence } from "entities";

@ObjectType()
class Coords {
  @Field()
  lat: number;
  @Field()
  lng: number;
}

@ObjectType()
export class ResidenceGQL implements Residence {
  @Field()
  resID: number;

  google_place_id: string;

  @Field()
  full_address: string;

  @Field()
  apt_num: string;

  @Field()
  street_num: string;

  @Field()
  route: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  postal_code: string;

  @Field(() => Coords)
  coords: Coords;

  @Field(() => Float, { nullable: true })
  avgRating?: number;

  @Field({ nullable: true })
  avgRent?: number;

  @Field(() => String)
  createdAt = new Date();

  @Field(() => String)
  updatedAt = new Date();
}
