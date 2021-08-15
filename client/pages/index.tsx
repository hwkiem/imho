import { AspectRatio, Grid, GridItem } from "@chakra-ui/react";
import { Residence } from "entities";
import { Layout } from "../components/layout/Layout";
import { Map } from "../components/ui/map";

const residences: Pick<Residence, "resID" | "full_address" | "coords">[] = [
  {
    resID: 11,
    full_address: "18 Roosevelt Pl, Rockville Centre, NY 11570, USA",
    coords: {
      lat: 40.66482329999999,
      lng: -73.6470927,
    },
  },
  {
    resID: 1,
    full_address: "12 W 104th St #3e, New York, NY 10025, USA",
    coords: {
      lat: 40.7969087,
      lng: -73.96190469999999,
    },
  },
];

const center = { lat: 40.7969087, lng: -73.96190469999999 };

const Index = () => {
  console.log("Index Page!");
  return (
    <Layout>
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <GridItem colSpan={5}>
          <AspectRatio ratio={21 / 9}>
            <Map residences={residences} center={center} />
          </AspectRatio>
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default Index;
