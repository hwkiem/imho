import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import {
    useWriteReviewMutation,
    WriteReviewInput,
} from '../../generated/graphql';
import { Map } from '../maps/map';

export const EntryReview: React.FC = () => {
    const [review] = useWriteReviewMutation();
    const router = useRouter();

    const initialValues: WriteReviewInput = {
        google_place_id: '',
        unit: '0',
        review_details: {
            lease_term: { start_date: undefined, end_date: undefined },
        },
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async () => {
            await review({
                variables: {
                    options: {
                        ...formik.values,
                    },
                },
            });
            router.push('/diver');
        },
    });

    return (
        <Flex minh="100vh" align="center" justify="center" bg="gray.50">
            <Stack spacing={8} mx="auto" maxW="xlg" py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Where's home?</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        We just need a bit of information to get your account
                        set up! Don't worry, this is anonymous data.
                    </Text>
                </Stack>
                <Center>
                    <Box
                        mx={'auto'}
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        p={8}
                    >
                        <Stack spacing={2}>
                            <Box h={'500px'} w={'800px'}>
                                <Map
                                    withSearchBar
                                    valueHook={async (
                                        place: google.maps.places.PlaceResult
                                    ) => {
                                        if (place.place_id)
                                            await formik.setFieldValue(
                                                'address',
                                                place.place_id
                                            );
                                    }}
                                    variant="small"
                                    searchTypes={['address']}
                                />
                            </Box>

                            <Center>
                                <Button
                                    variant={'solid'}
                                    colorScheme={'teal'}
                                    onClick={() => {
                                        formik.handleSubmit();
                                    }}
                                >
                                    Click me!
                                </Button>
                            </Center>
                        </Stack>
                    </Box>
                </Center>
            </Stack>
        </Flex>
    );
};
