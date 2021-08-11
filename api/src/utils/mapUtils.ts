import { GeocodeResponse } from '@googlemaps/google-maps-services-js';

export const geoToData = (g: GeocodeResponse) => {
  return g.data.results[0];
};

export const unpackLocation = (location: any) => {
  let apt = '',
    st = '',
    r = '',
    city = '',
    state = '',
    post = '';

  location.address_components.forEach((i: any) => {
    if (i.types.includes('subpremise')) {
      apt = i.long_name;
    } else if (i.types.includes('street_number')) {
      st = i.long_name;
    } else if (i.types.includes('route')) {
      r = i.long_name;
    } else if (i.types.includes('locality')) {
      city = i.long_name;
    } else if (i.types.includes('administrative_area_level_1')) {
      state = i.long_name;
    } else if (i.types.includes('postal_code')) {
      post = i.long_name;
    }
  });

  return [apt, st, r, city, state, post]; // whataver order i must expect
};
