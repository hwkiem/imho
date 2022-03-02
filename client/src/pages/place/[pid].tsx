import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Center,
    Grid,
    Popover,
    Progress,
    SimpleGrid,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { Variants } from 'framer-motion';
import {} from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import {
    FlagWithCount,
    useGetPlaceQuery,
    useTrackPlaceMutation,
} from '../../generated/graphql';
import useAuth from '../../lib/useAuth';
import { MotionContainer } from '../../utils/motion';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

export default function PlacePage() {
    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    const router = useRouter();

    let placeId = '';

    if (typeof router.query.pid === 'string') {
        placeId = router.query.pid;
    } else {
        console.log('incorrect query string...');
    }

    const { data, loading } = useGetPlaceQuery({
        variables: { placeId: placeId },
    });

    const [email, setEmail] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const [trackPlace] = useTrackPlaceMutation();
    const { user } = useAuth();

    const { placesService } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    });

    const [address, setAddress] = useState('');

    const [successfullyTracked, setSuccessfullyTracked] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress > 200) {
            router.push('/search');
        }
    }, [progress, router]);

    placesService?.getDetails({ placeId: placeId }, (place) =>
        place ? setAddress(place.formatted_address ?? '') : null
    );

    if (loading) {
        return <></>;
    }

    const place = data?.getPlace.result;

    let topFlagsSorted: (FlagWithCount & { color: string })[] = [];

    if (place?.topNFlags) {
        topFlagsSorted = place?.topNFlags?.cons
            .map((con) => ({ ...con, color: 'orange' }))
            .concat(
                place.topNFlags.pros.map((pro) => ({ ...pro, color: 'green' }))
            )
            .concat(
                place.topNFlags.dbks.map((dbk) => ({ ...dbk, color: 'red' }))
            )
            .sort((a, b) => b.cnt - a.cnt);
    }

    return data?.getPlace.result ? (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'found'}
        >
            <Center>
                <Badge
                    variant="gradient"
                    gradient={{
                        from: 'pink',
                        to: 'violet',
                    }}
                    size={'xl'}
                    leftSection={
                        <ActionIcon
                            size="xs"
                            color="blue"
                            radius="xl"
                            variant="transparent"
                            mr={20}
                            sx={(theme) => ({
                                color: 'white',
                                '&:hover': {
                                    color: theme.colors.gray[4],
                                },
                            })}
                            onClick={() => router.push('/search')}
                        >
                            <FaEdit />
                        </ActionIcon>
                    }
                >
                    {data.getPlace.result.formatted_address}
                </Badge>
            </Center>
            <Center>
                <Title
                    sx={{ fontSize: 40, fontWeight: 200 }}
                    align="center"
                    mt={100}
                >
                    <Text
                        inherit
                        component={'span'}
                        variant="gradient"
                        gradient={{ from: 'green', to: 'blue', deg: 45 }}
                        sx={{ letterSpacing: -2 }}
                    >
                        {data.getPlace.result.wouldRecommendRatio?.recommend} /{' '}
                        {data.getPlace.result.wouldRecommendRatio?.total}
                    </Text>{' '}
                    reviewers would recommend.
                </Title>
            </Center>
            <SimpleGrid cols={3} spacing={'lg'}>
                <Box>
                    <Title
                        sx={{
                            fontSize: 26,
                            fontWeight: 300,
                        }}
                        align="center"
                        mt={50}
                    >
                        Pros
                    </Title>
                    {data.getPlace.result.topNFlags?.pros.length == 0 ? (
                        <Center>
                            <Text>Anyone have anything nice to say?</Text>
                        </Center>
                    ) : (
                        <SimpleGrid
                            cols={1}
                            spacing="sm"
                            breakpoints={[
                                {
                                    maxWidth: 980,
                                    cols: 3,
                                    spacing: 'md',
                                },
                                {
                                    maxWidth: 755,
                                    cols: 2,
                                    spacing: 'sm',
                                },
                                {
                                    maxWidth: 600,
                                    cols: 1,
                                    spacing: 'sm',
                                },
                            ]}
                        >
                            {data.getPlace.result.topNFlags?.pros.map((f) => {
                                return (
                                    <Badge
                                        key={f.topic}
                                        color={'green'}
                                        variant={'filled'}
                                        size={'xl'}
                                        radius={'sm'}
                                        leftSection={<Box mr={10}>{f.cnt}</Box>}
                                    >
                                        {f.topic}
                                    </Badge>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </Box>
                <Box>
                    <Title
                        sx={{
                            fontSize: 26,
                            fontWeight: 300,
                        }}
                        align="center"
                        mt={50}
                    >
                        Cons
                    </Title>
                    {data.getPlace.result.topNFlags?.cons.length == 0 ? (
                        <Center>
                            <Text>No cons to be seen!</Text>
                        </Center>
                    ) : (
                        <SimpleGrid
                            cols={1}
                            spacing="sm"
                            breakpoints={[
                                {
                                    maxWidth: 980,
                                    cols: 3,
                                    spacing: 'md',
                                },
                                {
                                    maxWidth: 755,
                                    cols: 2,
                                    spacing: 'sm',
                                },
                                {
                                    maxWidth: 600,
                                    cols: 1,
                                    spacing: 'sm',
                                },
                            ]}
                        >
                            {data.getPlace.result.topNFlags?.cons.map((f) => {
                                return (
                                    <Badge
                                        key={f.topic}
                                        color={'orange'}
                                        variant={'filled'}
                                        size={'xl'}
                                        radius={'sm'}
                                        leftSection={<Box mr={10}>{f.cnt}</Box>}
                                    >
                                        {f.topic}
                                    </Badge>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </Box>
                <Box>
                    <Title
                        sx={{
                            fontSize: 26,
                            fontWeight: 300,
                        }}
                        align="center"
                        mt={50}
                    >
                        Dealbreakers
                    </Title>

                    {data.getPlace.result.topNFlags?.dbks.length == 0 ? (
                        <Center>
                            <Text>None! That's a great sign.</Text>
                        </Center>
                    ) : (
                        <SimpleGrid
                            cols={1}
                            spacing="sm"
                            breakpoints={[
                                {
                                    maxWidth: 980,
                                    cols: 3,
                                    spacing: 'md',
                                },
                                {
                                    maxWidth: 755,
                                    cols: 2,
                                    spacing: 'sm',
                                },
                                {
                                    maxWidth: 600,
                                    cols: 1,
                                    spacing: 'sm',
                                },
                            ]}
                        >
                            {data.getPlace.result.topNFlags?.dbks.map((f) => {
                                return (
                                    <Badge
                                        key={f.topic}
                                        color={'red'}
                                        variant={'filled'}
                                        size={'xl'}
                                        radius={'sm'}
                                        leftSection={<Box mr={10}>{f.cnt}</Box>}
                                    >
                                        {f.topic}
                                    </Badge>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </Box>
            </SimpleGrid>
            <Title
                sx={{
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: -2,
                }}
                align="left"
                mt={50}
            >
                Comments:
            </Title>
            {data.getPlace.result.residences.map((res) => (
                <Grid key={res.id}>
                    {res.reviews.map((rev) => (
                        <Box m={20} key={rev.id}>
                            {rev.feedback}
                        </Box>
                    ))}
                </Grid>
            ))}
        </MotionContainer>
    ) : (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <Title
                sx={{ fontSize: 60, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                Address not found...
            </Title>

            <Text align="center" size="lg">
                We hope you can forgive us. We're working on becoming the go-to
                spot for rental reviews.
            </Text>
            <Title align="center" mt={20}>
                Want to be notified when we have a review for this location?
            </Title>
            {user && (
                <Center mt={20}>
                    <Popover
                        opened={successfullyTracked}
                        onClose={() => router.push('/search')}
                        target={
                            <Button
                                onClick={() => {
                                    trackPlace({
                                        variables: {
                                            placeInput: {
                                                google_place_id: placeId,
                                                formatted_address: address,
                                            },
                                        },
                                    })
                                        .then(({ data }) => {
                                            if (data?.trackPlace.result) {
                                                setSuccessfullyTracked(true);
                                                setInterval(
                                                    () =>
                                                        setProgress(
                                                            (pr) => pr + 1
                                                        ),
                                                    10
                                                );
                                            } else if (
                                                data?.trackPlace.errors
                                            ) {
                                                console.log(
                                                    data.trackPlace.errors
                                                );
                                                setErrorMessage(
                                                    data.trackPlace.errors[0]
                                                        .error
                                                );
                                            } else {
                                                console.log(
                                                    'failed for some other reason...'
                                                );
                                                router.push('/error');
                                            }
                                        })
                                        .catch((err) => {
                                            console.log('caught some error');
                                            console.log(err);
                                            router.push('/error');
                                        });
                                }}
                            >
                                Yes Please!
                            </Button>
                        }
                        width={260}
                        position="bottom"
                        withArrow
                    >
                        <Text size="md">
                            You're now tracking this address. We'll email you if
                            something comes up!
                        </Text>
                        <Progress value={progress} size={'md'} />
                        <Text size={'md'} align={'center'}>
                            Redirecting you to the home screen.
                        </Text>
                    </Popover>
                </Center>
            )}
            {!user && (
                <>
                    <Center>
                        <TextInput
                            mt={20}
                            size={'xl'}
                            value={email}
                            onChange={(evt) =>
                                setEmail(evt.currentTarget.value)
                            }
                            placeholder="your.email@imho.com"
                            sx={{ width: '60%' }}
                            error={errorMessage}
                        />
                    </Center>
                    <Center>
                        <Popover
                            opened={successfullyTracked}
                            onClose={() => router.push('/search')}
                            target={
                                <Button
                                    mt={10}
                                    onClick={() => {
                                        trackPlace({
                                            variables: {
                                                placeInput: {
                                                    google_place_id: placeId,
                                                    formatted_address: address,
                                                },
                                                email: email,
                                            },
                                        })
                                            .then(({ data }) => {
                                                if (data?.trackPlace.result) {
                                                    setSuccessfullyTracked(
                                                        true
                                                    );
                                                    setInterval(
                                                        () =>
                                                            setProgress(
                                                                (pr) => pr + 1
                                                            ),
                                                        10
                                                    );
                                                } else if (
                                                    data?.trackPlace.errors
                                                ) {
                                                    console.log(
                                                        data.trackPlace.errors
                                                    );
                                                    setErrorMessage(
                                                        data.trackPlace
                                                            .errors[0].error
                                                    );
                                                } else {
                                                    console.log(
                                                        'failed for some other reason...'
                                                    );
                                                    router.push('/error');
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(
                                                    'caught some error'
                                                );
                                                console.log(err);
                                                router.push('/error');
                                            });
                                    }}
                                >
                                    Yes Please!
                                </Button>
                            }
                            width={260}
                            position="bottom"
                            withArrow
                        >
                            <Text size="md" align="center" mb={2}>
                                You're now tracking this address. We'll email
                                you if something comes up!
                            </Text>
                            <Progress value={progress} size={'md'} />
                            <Text size={'md'} align={'center'} mt={2}>
                                Redirecting you to the search screen.
                            </Text>
                        </Popover>
                    </Center>
                </>
            )}
        </MotionContainer>
    );
}
