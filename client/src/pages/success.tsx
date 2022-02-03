import {
    Button,
    Center,
    Container,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCreatePendingUserMutation } from '../generated/graphql';
import useAuth from '../lib/useAuth';

export default function SuccessPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const [createPendingUser] = useCreatePendingUserMutation();
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
                    <Center>
                        <TextInput
                            mt={20}
                            label="yes please!"
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
                                    createPendingUser({
                                        variables: { input: { email: email } },
                                    })
                                        .then((res) => {
                                            if (
                                                res.data?.createPendingUser
                                                    .result
                                            ) {
                                                router.push('/');
                                            } else if (
                                                res.data?.createPendingUser
                                                    .errors
                                            ) {
                                                console.log(
                                                    res.data.createPendingUser
                                                        .errors
                                                );
                                                setErrorMessage(
                                                    res.data.createPendingUser
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
                            Sign Me Up!
                        </Button>
                    </Center>
                </>
            )}
        </Container>
    );
}
