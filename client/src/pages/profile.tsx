import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import { Layout } from '../components/layout/layout';
import {
    RegularReviewFragment,
    RegularUserFragment,
} from '../generated/graphql';
import { Page } from '../types/page';

interface ProfileProps {
    me: RegularUserFragment;
    reviews?: RegularReviewFragment[];
}

const Profile: Page<ProfileProps> = ({ reviews }: ProfileProps) => {
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
                <Heading>Hello! Welcome to your dashboard.</Heading>
                <Box bg={'white'} w={'100%'} m={4} rounded={4} boxShadow={'sm'}>
                    <Heading size={'sm'} m={4}>
                        Welcome Home!
                    </Heading>
                </Box>
                <Stack direction={'row'} spacing={10} p={2}>
                    {reviews &&
                        reviews.map((review) => (
                            <Box
                                key={`${review.res_id}-${review.user_id}`}
                                bg={'lightblue'}
                                h={'200px'}
                                w={'200px'}
                            >
                                Review ID: {review.res_id}
                                Rent: {review.rent}
                                Rating: {review.rating}
                            </Box>
                        ))}
                </Stack>
            </Stack>
        </Flex>
    );
};

Profile.layout = Layout;

export default Profile;
