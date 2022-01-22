import { Button, Grid, Text, Title, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';

interface NavbarProps {
    onLoginLogout: () => void;
    isLoggedIn: boolean;
}

export const Navbar = ({ onLoginLogout, isLoggedIn }: NavbarProps) => {
    const router = useRouter();

    return (
        <Grid sx={() => ({ margin: 20 })} align={'center'}>
            <Grid.Col span={3}>
                <UnstyledButton
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    <Title
                        sx={{
                            fontSize: 30,
                            fontWeight: 300,
                            letterSpacing: -2,
                        }}
                        align="center"
                    >
                        <Text
                            inherit
                            variant="gradient"
                            gradient={{ from: 'pink', to: 'cyan', deg: 45 }}
                            component="span"
                        >
                            In My Housing Opinion
                        </Text>
                    </Title>
                </UnstyledButton>
            </Grid.Col>
            <Grid.Col span={3} offset={6}>
                <Button
                    onClick={() => {
                        onLoginLogout();
                    }}
                >
                    {isLoggedIn ? (
                        <Text color={'white'}>Logout</Text>
                    ) : (
                        <Text color={'white'}>Login or Sign Up</Text>
                    )}
                </Button>
            </Grid.Col>
        </Grid>
    );
};
