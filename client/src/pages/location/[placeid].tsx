import { Layout } from '../../components/layout';
import { Box, Heading, Container, Text, Stack } from '@chakra-ui/react';
import {
    GetLocationsByPlaceIdDocument,
    GetLocationsByPlaceIdQuery,
    RegularLocationFragment,
} from '../../generated/graphql';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { initializeApollo } from '../../lib/apollo';

interface LocationPageProps {
    location: RegularLocationFragment;
}

const LocationComponent: React.FC<LocationPageProps> = ({
    location,
}: LocationPageProps) => {
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
                        A little bit about <br />
                        <Text as={'span'} color={'pink.400'}>
                            {location.formatted_address}
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

const LocationPage: NextPage<LocationPageProps> = ({
    location,
}: LocationPageProps) => {
    return (
        <Layout title={'Location'} description={location.formatted_address}>
            <LocationComponent location={location} />
        </Layout>
    );
};

export async function getStaticProps({
    params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<LocationPageProps>> {
    const apollo = initializeApollo();
    console.log(params);
    if (params) {
        console.log(params.placeid);
        const locQuery = await apollo.query<GetLocationsByPlaceIdQuery>({
            query: GetLocationsByPlaceIdDocument,
            variables: { google_place_id: params.placeid },
        });

        console.log(locQuery.data.getLocationByPlaceId.location);

        if (locQuery.data.getLocationByPlaceId.location) {
            console.log('SUCCESS');
            return {
                props: {
                    location: locQuery.data.getLocationByPlaceId.location,
                },
            };
        }

        if (locQuery.error) {
            console.log('FAIL');
            console.log(locQuery.error);
        }
    }

    return { redirect: { permanent: false, destination: '/error' } };
}

export async function getStaticPaths() {
    const paths = [{ params: { placeid: 'ChIJeYPbLiL2wokR5B5i95aWXaU' } }];
    return { paths, fallback: false };
}

export default LocationPage;
