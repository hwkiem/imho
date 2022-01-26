import { Button, Grid, Text, Title, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import useAuth from '../lib/useAuth';

interface NavbarProps {
    openModal: () => void;
}

export const Navbar = ({ openModal }: NavbarProps) => {
    const router = useRouter();

    const { user, loading, logout } = useAuth();

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
                {!loading && (
                    <Button
                        onClick={() => {
                            if (!user) openModal();
                            else logout();
                        }}
                    >
                        {user ? (
                            <Text color={'white'}>Logout</Text>
                        ) : (
                            <Text color={'white'}>Login or Sign Up</Text>
                        )}
                    </Button>
                )}
            </Grid.Col>
        </Grid>
    );
};
