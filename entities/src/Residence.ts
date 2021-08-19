export default interface Residence {
  res_id: number;
  google_place_id: string;
  full_address: string;
  apt_num: string;
  street_num: string;
  route: string;
  city: string;
  state: string;
  postal_code: string;
  coords: { lat: number; lng: number };
  avg_rating?: number;
  avg_rent?: number;
  created_at: Date;
  updated_at: Date;
}
