import { ReactNode, useRef } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  InputGroup,
  IconButton,
  Button,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  chakra,
  Icon,
  UseDisclosureReturn,
  Drawer,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { RiHomeSmileFill } from "react-icons/ri";
import { ReviewForm } from "../forms/review";
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { gql, useApolloClient } from "@apollo/client";
import { isServer } from "../../utils/isServer";

const CRiHomeSmile = chakra(RiHomeSmileFill);

const Links = ["Diver", "Profile", "About"];

interface NavLinkProps {
  children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
}: {
  children: ReactNode;
}) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { data, loading } = useMeQuery({ fetchPolicy: "cache-only" });
  const [logout] = useLogoutMutation();
  const client = useApolloClient();
  const out = client.cache.readQuery({
    query: gql`
      query {
        me {
          errors {
            field
            message
          }
          users {
            user_id
            first_name
            last_name
          }
        }
      }
    `,
    variables: {},
  });
  console.log(out);

  // data is loading
  if (loading) {
    return <div></div>;
  } else if (!data?.me.users) {
    router.push("/login");
    return <div></div>;
  } else {
    return (
      <Center>
        <Box
          mt={20}
          bg={useColorModeValue("gray.100", "gray.900")}
          px={4}
          boxShadow={"2xl"}
          rounded={"md"}
          position={"absolute"}
          zIndex={2}
          w={"80%"}
        >
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Box>
                <Icon as={CRiHomeSmile} w={8} h={8} color={"teal"} />
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                ref={btnRef}
                onClick={async () => {
                  await logout();
                  await client.resetStore();
                }}
              >
                Logout
              </Button>
              <Tooltip label={JSON.stringify(data?.me.users[0])} fontSize="md">
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </Tooltip>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Center>
    );
  }
};
