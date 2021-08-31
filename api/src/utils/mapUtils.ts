import {
    GeocodeResponse,
    GeocodeResult,
} from '@googlemaps/google-maps-services-js';
import { Residence } from '../Residence/residence';

export const geoToData = (g: GeocodeResponse) => {
    return g.data.results[0];
};

export const unpackLocation = (location: GeocodeResult): Partial<Residence> => {
    let r: Partial<Residence> = {
        full_address: location.formatted_address,
    };
    if (!location.address_components) {
        throw Error('Not a valid location, cannot unpack');
    }

    location.address_components.forEach((i: any) => {
        if (i.types.includes('subpremise')) {
            r.apt_num = String(i.long_name);
        } else if (i.types.includes('street_number')) {
            r.street_num = String(i.long_name);
        } else if (i.types.includes('route')) {
            r.route = String(i.long_name);
        } else if (i.types.includes('locality')) {
            r.city = String(i.long_name);
        } else if (i.types.includes('administrative_area_level_1')) {
            r.state = String(i.long_name);
        } else if (i.types.includes('postal_code')) {
            r.postal_code = String(i.long_name);
        }
    });

    return r;
};

export const assembleResidence = (raw: any): Residence[] => {
    return raw.map((r: any) => {
        const { st_x, st_y, ...res } = r;
        return { coords: { lat: st_x, lng: st_y }, ...res };
    });
};
