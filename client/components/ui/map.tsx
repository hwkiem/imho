import { AspectRatio } from "@chakra-ui/react";
import { Residence } from "entities";
import GoogleMap from "google-map-react";

interface myMapProps {
  residences: Residence[];
}

const Marker = ({
  lat,
  lng,
  address,
}: {
  lat: number;
  lng: number;
  address: string;
}) => <div>{address}</div>;

export const myMap: React.FC<myMapProps> = ({ residences }) => {
  const defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 11,
  };

  return (
    <AspectRatio ratio={16 / 9}>
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMap
          bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_MAPS_API_KEY! }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {residences.map((res) => (
            <Marker
              lat={res.coords.lat}
              lng={res.coords.lng}
              address={res.full_address}
            />
          ))}
        </GoogleMap>
      </div>
    </AspectRatio>
  );
};
