import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useApollo } from "../lib/apollo";

function MyApp({ Component, pageProps }: any) {
  const apolloClient = useApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
