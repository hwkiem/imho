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
    Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { initializeApollo, useApollo } from '../../lib/apollo';
import { Location } from '../../generated/graphql';
import { GetStaticPropsResult, NextPage } from 'next';

const Sorry: React.FC = () => {
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
                        Well, this is a little <br />
                        <Text as={'span'} color={'pink.400'}>
                            awkward.
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        Oops! Something went wrong. Seems like we don't have any
                        reviews for this location. Don't worry though, you can
                        click the button below to sign up for an alert when this
                        building gets reviewed.
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        <Button
                            colorScheme={'pink'}
                            bg={'pink.400'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: 'pink.500',
                            }}
                        >
                            Remind Me!
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

const SorryPage: NextPage = () => {
    return (
        <Layout title={'Sorry'} description={'location not found'}>
            <Sorry />
        </Layout>
    );
};

export default SorryPage;
