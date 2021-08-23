import { AspectRatio, Grid, GridItem, Box } from "@chakra-ui/react";
import { Residence } from "entities";
import { GetServerSidePropsContext, NextPage, NextPageContext } from "next";
import { Layout } from "../components/layout/layout";
import { Map } from "../components/ui/map";
import { MeDocument, MeQuery } from "../generated/graphql";
import { initializeApollo } from "../lib/apollo";
import { Page } from "../types/page";
import { useIsAuth } from "../utils/useIsAuth";

const residences: Pick<Residence, "res_id" | "full_address" | "coords">[] = [
  {
    res_id: 11,
    full_address: "18 Roosevelt Pl, Rockville Centre, NY 11570, USA",
    coords: {
      lat: 40.66482329999999,
      lng: -73.6470927,
    },
  },
  {
    res_id: 1,
    full_address: "12 W 104th St #3e, New York, NY 10025, USA",
    coords: {
      lat: 40.7969087,
      lng: -73.96190469999999,
    },
  },
];

const center = { lat: 40.7969087, lng: -73.96190469999999 };

const Index: Page = () => {
  // useIsAuth();
  return <Map residences={residences} center={center} />;
};

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const apollo = initializeApollo({
    headers: req.headers,
  });
  const { data, loading } = await apollo.query<MeQuery>({ query: MeDocument });
  if (data.me.errors) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { a: "hello" } };
}

Index.layout = Layout;

export default Index;
