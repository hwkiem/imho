import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/raleway/400.css';
import '@fontsource/open-sans/700.css';
import { theme } from '../theme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo';
import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import type { Page } from '../types/page';

import 'react-month-picker/scss/month-picker.scss';

// this should give a better typing
type Props = AppProps & {
    Component: Page;
};
const MyApp = ({ Component, pageProps }: Props) => {
    // adjust accordingly if you disabled a layout rendering option
    const apolloClient = useApollo(pageProps);
    const getLayout = Component.getLayout ?? ((page) => page);
    const Layout = Component.layout ?? Fragment;

    return (
        <ApolloProvider client={apolloClient}>
            <ChakraProvider theme={theme}>
                <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
            </ChakraProvider>
        </ApolloProvider>
    );

    // or swap the layout rendering priority
    // return getLayout(<Layout><Component {...pageProps} /></Layout>)
};

export default MyApp;
