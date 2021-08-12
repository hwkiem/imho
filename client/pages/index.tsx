import { AspectRatio, Center } from "@chakra-ui/react";
import { Residence } from "entities";
import { Layout } from "../components/layout/layout";
import { myMap as Map } from "../components/ui/map";

const Index = () => {
  console.log("Index Page!");
  return (
    <Layout>
      <Map residences={[]} />
    </Layout>
  );
};

export default Index;
