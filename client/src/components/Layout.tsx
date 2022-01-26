import { Modal } from '@mantine/core';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';
import {
    ImhoUser,
    MeDocument,
    MeQuery,
    useMeQuery,
} from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import useAuth from '../lib/useAuth';
import { Navbar } from './Navbar';
import SessionModal from './SessionModal';

type LayoutProps = {
    children: JSX.Element | JSX.Element[];
};

export const Layout = ({ children }: LayoutProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (user) setModalOpen(false);
    }, [user]);

    return (
        <>
            <Navbar openModal={() => setModalOpen(true)} />
            <main>
                <SessionModal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
                {children}
            </main>
        </>
    );
};
