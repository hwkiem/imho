import { Button, Center, Container, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from '../lib/useAuth';

export default function SuccessPage() {
    const router = useRouter();
    const { user } = useAuth();
    return (
        <Container>
            <Title align="center" sx={{ fontSize: 40 }} mt={30}>
                Thanks for your anonymous review.
            </Title>
            <Text
                align="center"
                size="lg"
                mt={20}
                sx={(theme) => ({
                    color:
                        theme.colorScheme === 'dark'
                            ? theme.colors.gray[6]
                            : theme.colors.dark[2],
                })}
            >
                You are a f*cking hero.{' '}
            </Text>
            {user && (
                <Center mt={20}>
                    <Button onClick={() => router.push('/')}>
                        Take Me Home!
                    </Button>
                </Center>
            )}
            {!user && (
                <>
                    <Title align="center" mt={40}>
                        We are on a mission to fix renting. Want to stay up to
                        date on new features?
                    </Title>
                    <Center mt={20}>
                        <Button onClick={() => router.push('/register')}>
                            Sign Me Up!
                        </Button>
                    </Center>
                </>
            )}
        </Container>
    );
}
