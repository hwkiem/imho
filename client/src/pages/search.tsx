import { Layout } from '../components/layout';
import Head from 'next/head';
import { Box, Heading, Container, Text, Stack } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { GoogleBar } from '../components/googlebar';

const CATCH_PHRASES = ['100% Free!', 'Welcome Home!', 'Reinventing Renting.'];

const getCatchPhrase = () => {
    return CATCH_PHRASES[Math.floor(Math.random() * CATCH_PHRASES.length)];
};

const Search: React.FC = () => {
    // show house / apt buttons

    const router = useRouter();

    // autocomplete widget
    const { ref } = usePlacesWidget<HTMLInputElement>({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        onPlaceSelected: (place) => {
            console.log(place.place_id);
            router.push(`/location/${place.place_id}`);
        },
        options: {
            types: ['address'],
        },
    });

    const onSearchSelect = (placeid: string | undefined) => {
        if (placeid) router.push(`/location/${placeid}`);
        else router.push(`/location/sorry`);
    };

    return (
        <>
            <Container maxW={'3xl'} key={'search'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}
                >
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}
                    >
                        <Text as={'span'} color={'pink.400'}>
                            You swing the address,
                        </Text>{' '}
                        <br />
                        we've got the details.
                    </Heading>
                    <Text color={'gray.500'}>
                        Just enter an address and we'll provide detailed
                        ratings, reviews, and common issues past tenants have
                        mentioned.
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        <GoogleBar onSelect={onSearchSelect} />
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

const SearchPage: NextPage = () => {
    return (
        <Layout title="Home" description={'splash'}>
            <Search />
        </Layout>
    );
};

export default SearchPage;
