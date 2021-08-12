export default interface Residence {
  resID: number;
  google_place_id: string;
  full_address: string;
  apt_num: string;
  street_num: string;
  route: string;
  city: string;
  state: string;
  postal_code: string;
  coords: { lat: number; lng: number };
  avgRating?: number;
  avgRent?: number;
  createdAt: Date;
  updatedAt: Date;
}
