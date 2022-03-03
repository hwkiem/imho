import {
    Button,
    Grid,
    Text,
    Title,
    UnstyledButton,
    ActionIcon,
} from '@mantine/core';
import { RiLogoutBoxLine, RiUser2Line } from 'react-icons/ri';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React from 'react';
import useAuth from '../lib/useAuth';

interface NavbarProps {
    openModal: () => void;
}

export const Navbar = ({ openModal }: NavbarProps) => {
    const router = useRouter();

    const { user, loading, logout } = useAuth();

    const smallScreen = useMediaQuery('(max-width: 755px)');

    return (
        <Grid sx={() => ({ margin: 20 })} align={'center'}>
            <Grid.Col span={smallScreen ? 8 : 3}>
                <UnstyledButton
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    <Title
                        sx={{
                            fontSize: 30,
                            fontWeight: 300,
                            '@media (max-width: 755px)': {
                                fontSize: 20,
                            },
                        }}
                        align="center"
                    >
                        <Text
                            inherit
                            variant="gradient"
                            gradient={{ from: 'pink', to: 'cyan', deg: 45 }}
                        >
                            In My Housing Opinion
                        </Text>
                    </Title>
                </UnstyledButton>
            </Grid.Col>
            <Grid.Col span={smallScreen ? 2 : 3} offset={smallScreen ? 2 : 6}>
                {!loading && (
                    <>
                        {smallScreen ? (
                            <ActionIcon
                                size={'xl'}
                                color={'pink'}
                                radius={'xl'}
                                variant={'filled'}
                                onClick={() => {
                                    if (!user) openModal();
                                    else logout();
                                }}
                            >
                                {!user ? <RiUser2Line /> : <RiLogoutBoxLine />}
                            </ActionIcon>
                        ) : (
                            <Button
                                onClick={() => {
                                    if (!user) openModal();
                                    else logout();
                                }}
                            >
                                {user ? (
                                    <Text color={'white'}>Logout</Text>
                                ) : (
                                    <Text color={'white'}>
                                        Login or Sign Up
                                    </Text>
                                )}
                            </Button>
                        )}
                    </>
                )}
            </Grid.Col>
        </Grid>
    );
};
