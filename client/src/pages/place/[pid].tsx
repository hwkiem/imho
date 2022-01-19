import { Accordion, Badge, Box, SimpleGrid, Text, Title } from '@mantine/core';
import { Variants } from 'framer-motion';
import {} from 'next';
import { useRouter } from 'next/router';
import { useGetPlaceQuery } from '../../generated/graphql';
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

    return loading ? (
        <></>
    ) : data?.getPlace.result ? (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <Title
                sx={{
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: -2,
                }}
                align="center"
                mt={50}
            >
                <Text
                    sx={{ fontSize: 50, fontWeight: 700, letterSpacing: -2 }}
                    align="center"
                    mt={100}
                    variant="gradient"
                    gradient={{ from: 'green', to: 'purple', deg: 45 }}
                >
                    {data.getPlace.result.formatted_address}
                </Text>
            </Title>
            <Title
                sx={{
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: -2,
                }}
                align="left"
                mt={50}
            >
                Most Common Flags
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
                {data.getPlace.result.topNFlags?.pros.map((pro) => (
                    <Badge
                        key={pro.topic}
                        color={'green'}
                        variant={'filled'}
                        size={'xl'}
                        radius={'sm'}
                        leftSection={<Box mr={10}>{pro.cnt}</Box>}
                    >
                        {pro.topic}
                    </Badge>
                ))}
                {data.getPlace.result.topNFlags?.cons.map((con) => (
                    <Badge
                        key={con.topic}
                        color={'orange'}
                        variant={'filled'}
                        size={'xl'}
                        radius={'sm'}
                        leftSection={<Box mr={10}>{con.cnt}</Box>}
                    >
                        {con.topic}
                    </Badge>
                ))}
                {data.getPlace.result.topNFlags?.dbks.map((dbk) => (
                    <Badge
                        key={dbk.topic}
                        color={'red'}
                        variant={'filled'}
                        size={'xl'}
                        radius={'sm'}
                        leftSection={<Box mr={10}>{dbk.cnt}</Box>}
                    >
                        {dbk.topic}
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
                Dealbreakers
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
                {data.getPlace.result.topNFlags?.dbks.map((dbk) => (
                    <Badge
                        key={dbk.topic}
                        color={'red'}
                        variant={'filled'}
                        size={'xl'}
                        radius={'sm'}
                        leftSection={<Box mr={10}>{dbk.cnt}</Box>}
                    >
                        {dbk.topic}
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
                Residences
            </Title>
            <Accordion>
                {data.getPlace.result.residences.map((res) => (
                    <Accordion.Item key={res.id} label={res.unit}>
                        Average Rating: {res.averageRating}
                        <br></br>
                        Number of Reviews: {res.reviews.length}
                        <Accordion>
                            {res.reviews.map((rev) => {
                                const date = new Date(rev.createdAt);
                                return (
                                    <Accordion.Item
                                        key={rev.id}
                                        label={date.toLocaleDateString(
                                            'default',
                                            { month: 'long', year: '2-digit' }
                                        )}
                                    >
                                        {rev.rating}
                                        <br></br>
                                        {rev.feedback}
                                    </Accordion.Item>
                                );
                            })}
                        </Accordion>
                    </Accordion.Item>
                ))}
            </Accordion>
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
