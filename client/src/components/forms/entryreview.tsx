import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react'
import { Form, useFormik, yupToFormErrors } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useWriteReviewMutation } from '../../generated/graphql'
import { Map } from '../ui/maps/map'

export const EntryReview: React.FC = () => {
    const [review, { data }] = useWriteReviewMutation()
    const router = useRouter()

    const formik = useFormik({
        initialValues: { address: '' },
        onSubmit: async () => {
            const res = await review({
                variables: {
                    options: { google_place_id: formik.values.address },
                },
            })
            console.log(res.data?.writeReview.reviews)
            router.push('/diver')
        },
    })

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
                                            )
                                    }}
                                    variant="small"
                                    searchTypes={['geocode']}
                                />
                            </Box>

                            <Center>
                                <Button
                                    variant={'solid'}
                                    colorScheme={'teal'}
                                    onClick={() => {
                                        formik.handleSubmit()
                                        router
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
    )
}
