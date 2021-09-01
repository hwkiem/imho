import { Box, Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Layout } from '../components/layout/layout';
import {
    MeDocument,
    MeQuery,
    RegularReviewFragment,
    RegularUserFragment,
    GetReviewsByUserIdQuery,
    GetReviewsByUserIdDocument,
} from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import { Page } from '../types/page';
import { useIsAuth } from '../utils/useIsAuth';

interface ProfileProps {
    me: RegularUserFragment;
    reviews?: RegularReviewFragment[];
}

const Profile: Page<ProfileProps> = ({ me, reviews }) => {
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
                <Stack direction={'row'} spacing={10} p={2}>
                    {reviews &&
                        reviews.map((review) => (
                            <Box bg={'lightblue'} h={'200px'} w={'200px'}>
                                Review ID: {review.res_id}
                            </Box>
                        ))}
                </Stack>
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
        const me = meQuery.data.me.users[0];
        const reviewQuery = apollo.query<GetReviewsByUserIdQuery>({
            query: GetReviewsByUserIdDocument,
            variables: { user_ids: [me.user_id] },
        });
        const props: GetServerSidePropsResult<ProfileProps> = {
            props: {
                me: me,
            },
        };
        const resp = (await reviewQuery).data.getReviewsByUserId;
        if (resp) {
            if (resp.reviews) {
                props.props.reviews = resp.reviews;
                return props;
            }
            if (resp.errors) console.log(resp.errors);
            return props;
        } else {
            console.log(resp);
            return props;
        }
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
