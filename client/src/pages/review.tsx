import { Flex, Stack } from '@chakra-ui/react';
import { RetroForm } from '../components/forms/retro/retroform';

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
                <RetroForm />
            </Stack>
        </Flex>
    );
};

export default Review;
