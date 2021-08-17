import { Box, useDisclosure } from "@chakra-ui/react";
import { NavBar } from "../section/navbar";

export const Layout: React.FC = ({ children }) => {
  const reviewDrawer = useDisclosure();
  return (
    <Box height={"100vh"}>
      <NavBar reviewDrawer={reviewDrawer} />
      <Box h={"100%"}>{children}</Box>
    </Box>
  );
};
