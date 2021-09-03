import {
    Box,
    Button,
    Center,
    chakra,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    InputGroup,
    List,
    ListItem,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Form, Formik, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RiMoneyDollarCircleFill, RiStarSmileFill } from 'react-icons/ri';
import {
    useWriteReviewMutation,
    WriteReviewInput,
} from '../../generated/graphql';
import { Map } from '../ui/maps/map';
import { SliderInput } from '../utils/sliderInput';

export const RetroReview: React.FC = () => {
    const router = useRouter();
    const [review, { data }] = useWriteReviewMutation();

    const formik = useFormik({
        initialValues: {
            google_place_id: '',
            rating: 0,
            rent: 0,
        },
        onSubmit: async () => {
            const res = await review({
                variables: {
                    options: {
                        google_place_id: formik.values.google_place_id,
                        rating: formik.values.rating,
                        rent: formik.values.rent,
                    },
                },
            });
            router.push('/profile');
        },
    });

    const [step, setStep] = useState(0);

    const StepComponent: React.FC<{ step: number }> = ({ step }) => {
        switch (step) {
            case 1:
                const [placeId, setPlaceId] = useState('');
                return (
                    <Center>
                        <Stack spacing={2}>
                            <Box h={'300px'} w={'800px'}>
                                <Map
                                    withSearchBar
                                    valueHook={async (
                                        place: google.maps.places.PlaceResult
                                    ) => {
                                        if (place.place_id)
                                            setPlaceId(place.place_id);
                                    }}
                                    variant="small"
                                    searchTypes={['address']}
                                />
                            </Box>

                            <Center>
                                <Button
                                    variant={'solid'}
                                    onClick={() => {
                                        formik.setFieldValue(
                                            'google_place_id',
                                            placeId
                                        );
                                        setStep(2);
                                    }}
                                >
                                    Next Step
                                </Button>
                            </Center>
                        </Stack>
                    </Center>
                );
            case 2:
                const [rating, setRating] = useState(0);
                const [rent, setRent] = useState(1000);
                return (
                    <>
                        <Heading fontSize={'2xl'} p={4}>
                            Tell us a bit more about your place.
                        </Heading>
                        <Box h={'300px'} w={'800px'}>
                            <Stack p={6} spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Rating!</FormLabel>
                                    <SliderInput
                                        defaultValue={0}
                                        precision={1}
                                        step={1}
                                        min={0}
                                        max={5}
                                        value={rating}
                                        handleChange={setRating}
                                    >
                                        <Icon
                                            as={chakra(RiStarSmileFill)}
                                            w={6}
                                            h={6}
                                            color={'teal'}
                                        />
                                    </SliderInput>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Rent</FormLabel>
                                    <SliderInput
                                        defaultValue={2000}
                                        precision={0}
                                        step={100}
                                        min={0}
                                        max={5000}
                                        value={rent}
                                        handleChange={setRent}
                                    >
                                        <Icon
                                            as={chakra(RiMoneyDollarCircleFill)}
                                            w={6}
                                            h={6}
                                            color={'teal'}
                                        />
                                    </SliderInput>
                                </FormControl>
                            </Stack>
                        </Box>
                        <Center>
                            <Button
                                variant={'solid'}
                                onClick={() => {
                                    formik.setFieldValue('rating', rating);
                                    formik.setFieldValue('rent', rent);
                                    setStep(3);
                                }}
                            >
                                Next Step
                            </Button>
                        </Center>
                    </>
                );
            case 3:
                console.log(formik.values);
                return (
                    <>
                        <Heading>Ready to submit this review?</Heading>
                        <List>
                            <ListItem>
                                PlaceId: {formik.values.google_place_id}
                            </ListItem>
                            <ListItem>Rating: {formik.values.rating}</ListItem>
                            <ListItem>Rent: {formik.values.rent}</ListItem>
                        </List>
                        <Button onClick={() => formik.handleSubmit()}>
                            Submit!
                        </Button>
                    </>
                );
            default:
                return (
                    <>
                        <Button
                            variant={'solid'}
                            colorScheme={'teal'}
                            onClick={() => {
                                setStep(1);
                            }}
                        >
                            Should we get started?
                        </Button>
                    </>
                );
        }
    };

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
                        <Stack spacing={2}>
                            <StepComponent step={step} />
                        </Stack>
                    </Box>
                </Center>
            </Stack>
        </Flex>
    );
};
