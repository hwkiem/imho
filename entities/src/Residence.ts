export class Residence {
  resID: number;

  google_place_id: string;

  full_address: string;

  apt_num: string;

  street_num: string;

  route: string;

  city: string;

  state: string;

  postal_code: string;

  avgRating?: number;

  avgRent?: number;

  createdAt = new Date();

  updatedAt = new Date();
}
