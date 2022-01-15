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

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

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

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
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
                            <Component {...pageProps} key={router.route} />
                        </AnimatePresence>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}
