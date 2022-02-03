import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
    Button,
    Center,
    Grid,
    SimpleGrid,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { Variants } from 'framer-motion';
import {} from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import {
    FlagWithCount,
    PlaceType,
    useCreatePendingUserMutation,
    useGetPlaceQuery,
    useTrackPlaceMutation,
} from '../../generated/graphql';
import useAuth from '../../lib/useAuth';
import { MotionContainer } from '../../utils/motion';

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
                    sx={{
                        fontSize: 30,
                        fontWeight: 500,
                        letterSpacing: -2,
                    }}
                    align="left"
                    mt={50}
                >
                    Average Rating:
                </Title>
            </Center>
            <Center>
                <Text
                    variant="gradient"
                    gradient={{ from: 'orange', to: 'violet', deg: 45 }}
                    sx={{ fontSize: 40 }}
                >
                    {data.getPlace.result.averageRating?.toFixed(1)}%
                </Text>
            </Center>
            <Title
                sx={{
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: -2,
                }}
                align="left"
                mt={50}
            >
                Common Flags:
            </Title>
            <SimpleGrid
                mt={30}
                cols={5}
                spacing="lg"
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
                {topFlagsSorted.map((fg) => (
                    <Badge
                        key={fg.topic}
                        color={fg.color}
                        variant={'filled'}
                        size={'xl'}
                        radius={'sm'}
                        leftSection={<Box mr={10}>{fg.cnt}</Box>}
                    >
                        {fg.topic}
                    </Badge>
                ))}
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
                    <Button
                        onClick={() => {
                            trackPlace({
                                variables: {
                                    input: {
                                        userInput: { email: user.email },
                                        placeInput: {
                                            google_place_id: placeId,
                                            formatted_address: '',
                                            type: PlaceType.Single,
                                        },
                                    },
                                },
                            });
                        }}
                    >
                        Yes Please!
                    </Button>
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
                        <Button
                            mt={20}
                            variant={'subtle'}
                            size={'xl'}
                            onClick={async () => {
                                if (email) {
                                    trackPlace({
                                        variables: {
                                            input: {
                                                placeInput: {
                                                    google_place_id: placeId,
                                                    formatted_address: '',
                                                    type: PlaceType.Single,
                                                },
                                                userInput: {
                                                    email: email,
                                                },
                                            },
                                        },
                                    })
                                        .then((res) => {
                                            if (res.data?.trackPlace.result) {
                                                router.push('/');
                                            } else if (
                                                res.data?.trackPlace.errors
                                            ) {
                                                console.log(
                                                    res.data.trackPlace.errors
                                                );
                                                setErrorMessage(
                                                    res.data.trackPlace
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
                                            console.log('caught some error');
                                            console.log(err);
                                            router.push('/error');
                                        });
                                }
                            }}
                        >
                            Yes Please!
                        </Button>
                    </Center>
                </>
            )}
        </MotionContainer>
    );
}
