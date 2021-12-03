import { Layout } from '../../components/layout';
import Head from 'next/head';
import {
    Box,
    Heading,
    Container,
    Text,
    Stack,
    createIcon,
    InputGroup,
    Input,
    InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { initializeApollo, useApollo } from '../../lib/apollo';
import { Location } from '../../generated/graphql';
import { GetStaticPropsResult, NextPage } from 'next';

interface LocationProps {
    location: Location;
}

const LocationComponent: React.FC<LocationProps> = ({ location }) => {
    const router = useRouter();
    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
                    rel="stylesheet"
                />
            </Head>
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
                        A little bit about <br />
                        <Text as={'span'} color={'pink.400'}>
                            {location.full_address}
                        </Text>
                    </Heading>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        <Text>Some shit down here.</Text>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

interface LocationPageProps {
    location: Location;
}

const LocationPage: NextPage<LocationPageProps> = ({ location }) => {
    return (
        <Layout title={'Location'} description={location.full_address}>
            <LocationComponent location={location} />
        </Layout>
    );
};

export async function getStaticProps(): Promise<
    GetStaticPropsResult<LocationPageProps>
> {
    const temp: Location = {
        city: 'New York',
        coords: { lat: 71.04, lng: 44.23 },
        full_address: '12 West 104th Street',
        google_place_id: 'some bs',
        loc_id: 2,
        postal_code: '10025',
        route: 'W 104th St',
        state: 'New York',
        street_num: '12',
    };
    return { props: { location: temp } };
}

export async function getStaticPaths() {
    const paths = [{ params: { placeid: 'ChIJeYPbLiL2wokR5B5i95aWXaU' } }];
    return { paths, fallback: false };
}

export default LocationPage;
