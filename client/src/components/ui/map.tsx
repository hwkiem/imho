import {
  Box,
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { Residence } from "entities";
import GoogleMap from "google-map-react";
import { chakra } from "@chakra-ui/react";
import { RiHomeSmile2Fill } from "react-icons/ri";
import { Icon } from "@chakra-ui/react";
import React from "react";
import ReviewModal from "./reviewModal";

const CRiHomeSmile = chakra(RiHomeSmile2Fill);

interface MapProps {
  residences: Pick<Residence, "full_address" | "coords">[];
  center: { lat: number; lng: number };
}

interface MarkerProps {
  lat: number;
  lng: number;
  address: string;
}

const Marker: React.FC<MarkerProps> = () => (
  <Popover>
    <PopoverTrigger>
      <Icon
        as={CRiHomeSmile}
        h={8}
        w={8}
        style={{ transform: "translate(-50%, -100%)" }}
        color={"teal"}
      />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Residence Info here</PopoverHeader>
      <PopoverBody>We can put review data in here...</PopoverBody>
    </PopoverContent>
  </Popover>
);

export const Map: React.FC<MapProps> = ({ residences, center }) => {
  return (
    <Box w="100%" h="100%">
      <ReviewModal />
      <GoogleMap
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_MAPS_API_KEY! }}
        defaultCenter={center}
        defaultZoom={11}
        options={(map) => ({
          panControl: false,
          fullscreenControl: false,
          zoomControl: false,
          scrollwheel: true,
          mapTypeControl: false,
        })}
      >
        {residences.map((res) => (
          <Marker
            key={res.full_address}
            lat={res.coords.lat}
            lng={res.coords.lng}
            address={res.full_address}
          />
        ))}
      </GoogleMap>
    </Box>
  );
};
