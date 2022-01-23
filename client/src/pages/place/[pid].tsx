import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
    Center,
    Grid,
    SimpleGrid,
    Text,
    Title,
} from '@mantine/core';
import { Variants } from 'framer-motion';
import {} from 'next';
import { useRouter } from 'next/router';
import { FaEdit } from 'react-icons/fa';
import { FlagWithCount, useGetPlaceQuery } from '../../generated/graphql';
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

    console.log(data);

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
                sx={{ fontSize: 100, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                Address not found.
            </Title>
        </MotionContainer>
    );
}
