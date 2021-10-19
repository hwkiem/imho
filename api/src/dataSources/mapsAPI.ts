import { Client, GeocodeResult } from '@googlemaps/google-maps-services-js';
import { DataSource } from 'apollo-datasource';
import { Service } from 'typedi';
import { FieldError, PlaceIDResponse } from '../types/object_types';
import { geoToData } from '../utils/mapUtils';

@Service()
export class googleMapsHandler extends DataSource {
    #client: Client;
    #apiKey: string;
    constructor() {
        super();
        if (!process.env.GOOGLE_MAPS_API_KEY) {
            throw Error('NO GCP API KEY');
        }
        this.#apiKey = process.env.GOOGLE_MAPS_API_KEY;
        this.#client = new Client({});
    }

    locationFromPlaceID = async (
        place_id: string
    ): Promise<GeocodeResult | FieldError> => {
        try {
            return geoToData(
                await this.#client.geocode({
                    params: {
                        place_id: place_id,
                        key: this.#apiKey,
                    },
                })
            );
        } catch (e) {
            return { field: 'googleAPI', message: e.toString() };
        }
    };

    placeIdFromAddress = async (address: string): Promise<PlaceIDResponse> => {
        let r: PlaceIDResponse = {};
        try {
            const result = geoToData(
                await this.#client.geocode({
                    params: {
                        address: address,
                        key: this.#apiKey,
                    },
                })
            );
            r.place_id = result.place_id;
        } catch (e) {
            r.errors = { field: 'googleAPI', message: e.toString() };
        }
        return r;
    };
}
