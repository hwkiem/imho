import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider
      client={
        new ApolloClient({
          uri: "http://localhost:3000/graphql",
          cache: new InMemoryCache(),
          credentials: "include",
        })
      }
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
