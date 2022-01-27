import { AppProps } from 'next/app';
import Head from 'next/head';
import {
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme, useHotkeys } from '@mantine/hooks';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../lib/useAuth';
import { AuthGuard } from '../lib/AuthGuard';
import { NextPage } from 'next';

export type NextPageWithAuth = NextPage & {
    requireAuth?: boolean;
};

type AppPropsWithAuth = AppProps & {
    Component: NextPageWithAuth;
};

export default function App({ Component, pageProps }: AppPropsWithAuth) {
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

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
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
                                        <Layout>
                                            <Component
                                                {...pageProps}
                                                key={router.route}
                                            />
                                        </Layout>
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
