import { AppProps } from 'next/app';
import Head from 'next/head';
import {
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme, useHotkeys } from '@mantine/hooks';
import { ReactElement, ReactNode, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../lib/useAuth';
import { AuthGuard } from '../lib/AuthGuard';
import { NextPage } from 'next';

export type CustomNextPage = NextPage & {
    requireAuth?: boolean;
    getLayout?: (page: ReactElement) => ReactNode;
};

type CustomAppProps = AppProps & {
    Component: CustomNextPage;
};

export default function App({ Component, pageProps }: CustomAppProps) {
    // fetch user preferred ColorScheme and set default
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] =
        useState<ColorScheme>(preferredColorScheme);

    // color scheme toggle function
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    // ctr/cmd J to quick switch color scheme
    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    const router = useRouter();

    const apolloClient = useApollo(pageProps);

    const shouldGuard = Component.requireAuth;

    const getLayout =
        Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
                />
            </Head>
            <ApolloProvider client={apolloClient}>
                <AuthProvider>
                    <ColorSchemeProvider
                        colorScheme={colorScheme}
                        toggleColorScheme={toggleColorScheme}
                    >
                        <MantineProvider
                            theme={{ colorScheme }}
                            withNormalizeCSS
                            withGlobalStyles
                        >
                            <NotificationsProvider>
                                <AnimatePresence exitBeforeEnter>
                                    <AuthGuard
                                        guard={
                                            shouldGuard ??
                                            (process.env.NODE_ENV ===
                                            'development'
                                                ? false
                                                : true)
                                        }
                                    >
                                        {getLayout(
                                            <Component
                                                {...pageProps}
                                                key={router.route}
                                            />
                                        )}
                                    </AuthGuard>
                                </AnimatePresence>
                            </NotificationsProvider>
                        </MantineProvider>
                    </ColorSchemeProvider>
                </AuthProvider>
            </ApolloProvider>
        </>
    );
}
