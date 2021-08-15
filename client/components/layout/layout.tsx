import { Box, useDisclosure } from "@chakra-ui/react";
import { NavBar } from "../section/navbar";

export const Layout: React.FC = ({ children }) => {
  const reviewDrawer = useDisclosure();
  return (
    <>
      <NavBar reviewDrawer={reviewDrawer} />
      <Box>{children}</Box>
    </>
  );
};
