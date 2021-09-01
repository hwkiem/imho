import { Box, Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Layout } from '../components/layout/layout';
import {
    MeDocument,
    MeQuery,
    RegularReviewFragment,
    RegularUserFragment,
} from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import { Page } from '../types/page';
import { useIsAuth } from '../utils/useIsAuth';

interface ProfileProps {
    me: RegularUserFragment;
    reviews: RegularReviewFragment;
}

const Profile: Page<ProfileProps> = ({ me }) => {
    useIsAuth();
    return (
        <Flex minH={'100vh'} bg={'gray.50'}>
            <Stack
                w={'100%'}
                direction={'column'}
                spacing={8}
                my={12}
                py={12}
                px={6}
                mx={6}
            >
                <Heading>
                    Hello {me.first_name}! Welcome to your dashboard.
                </Heading>
                <Box bg={'white'} w={'100%'} m={4} rounded={4} boxShadow={'sm'}>
                    <Heading size={'sm'} m={4}>
                        Welcome Home!
                    </Heading>
                </Box>
                <Stack></Stack>
            </Stack>
        </Flex>
    );
};

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext): Promise<
    GetServerSidePropsResult<ProfileProps>
> => {
    const apollo = initializeApollo({
        headers: req.headers,
    });
    const meQuery = await apollo.query<MeQuery>({
        query: MeDocument,
    });
    if (meQuery.data.me.errors) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    } else if (meQuery.data.me.users) {
        return {
            props: {
                me: meQuery.data.me.users[0],
            },
        };
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/error',
            },
        };
    }
};

Profile.layout = Layout;

export default Profile;
