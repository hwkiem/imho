import { Flex, Stack, Heading, Center, Box, Text } from '@chakra-ui/react';
import React from 'react';

export const FormLayout: React.FC = ({ children }) => {
    return (
        <Flex minh="100vh" align="center" justify="center" bg="gray.50">
            <Stack spacing={4} mx="auto" maxW="xlg" py={4} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Write a Retro!</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        A Retro is review you write about a place you used to
                        call home. <br /> The more Retros WE write the more
                        powerful WE become!
                    </Text>
                </Stack>
                <Center>
                    <Box
                        mx={'auto'}
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        p={4}
                    >
                        <Stack spacing={2}>{children}</Stack>
                    </Box>
                </Center>
            </Stack>
        </Flex>
    );
};
