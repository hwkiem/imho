import { Client, GeocodeResult } from '@googlemaps/google-maps-services-js';
import { DataSource } from 'apollo-datasource';
import { FieldError } from '../types';
import { geoToData } from '../utils/mapUtils';

export class googleMapsHandler extends DataSource {
  #client: Client;
  constructor(client: Client) {
    super();
    this.#client = client;
  }

  locationFromPlaceID = async (
    place_id: string
  ): Promise<GeocodeResult | FieldError> => {
    try {
      return geoToData(
        await this.#client.geocode({
          params: {
            place_id: place_id,
            key: process.env.GOOGLE_MAPS_API_KEY!,
          },
        })
      );
    } catch (e) {
      return { field: 'googleAPI', message: e.toString() };
    }
  };
}
