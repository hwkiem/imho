import { Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { RetroReview } from '../components/forms/retroreview';

const Review: React.FC = () => {
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
                <RetroReview />
            </Stack>
        </Flex>
    );
};

export default Review;
