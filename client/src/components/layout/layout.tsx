import { Box, useDisclosure } from "@chakra-ui/react";
import { NavBar } from "../section/navbar";

export const Layout: React.FC = ({ children }) => {
  return (
    <Box height={"100vh"}>
      <NavBar />
      <Box h={"100%"}>{children}</Box>
    </Box>
  );
};
