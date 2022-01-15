import Link from 'next/link';
import { Title, Text, Grid, Box, Button, Center } from '@mantine/core';
import { FaRegCommentDots, FaSearchengin } from 'react-icons/fa';
import { RiLoginBoxLine } from 'react-icons/ri';
import { Variants } from 'framer-motion';
import { MotionContainer } from '../utils/motion';

export default function HomePage() {
    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    return (
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
                Welcome to{' '}
                <Text
                    inherit
                    variant="gradient"
                    gradient={{ from: 'pink', to: 'cyan', deg: 45 }}
                    component="span"
                >
                    IMHO
                </Text>
            </Title>
            <Text
                color="dimmed"
                align="center"
                size="lg"
                sx={{ maxWidth: 580 }}
                mx="auto"
                mt="xl"
            >
                Finding your next home is difficult. We provide answers to all
                the questions you wish you could ask. Is that restaurant across
                the street really noisy? How many hot showers will you really
                get? Is the morning light in the kitchen perfect for your food
                blog? Let IMHO help you find your oasis!
            </Text>
            <Box>
                <Grid mt={40} justify="space-between">
                    <Grid.Col span={3}>
                        <Center>
                            <Link href="/review" passHref>
                                <Button
                                    variant="gradient"
                                    gradient={{
                                        from: 'grape',
                                        to: 'pink',
                                        deg: 35,
                                    }}
                                    leftIcon={<FaRegCommentDots size={18} />}
                                >
                                    Write a Review
                                </Button>
                            </Link>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Center>
                            <Link href="/search" passHref>
                                <Button
                                    component="a"
                                    variant="gradient"
                                    gradient={{
                                        from: 'grape',
                                        to: 'pink',
                                        deg: 35,
                                    }}
                                    leftIcon={<FaSearchengin size={18} />}
                                >
                                    Search our Records
                                </Button>
                            </Link>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Center>
                            <Link href="/login" passHref>
                                <Button
                                    variant="gradient"
                                    gradient={{
                                        from: 'grape',
                                        to: 'pink',
                                        deg: 35,
                                    }}
                                    leftIcon={<RiLoginBoxLine size={18} />}
                                >
                                    Login to Dashboard
                                </Button>
                            </Link>
                        </Center>
                    </Grid.Col>
                </Grid>
            </Box>
        </MotionContainer>
    );
}
