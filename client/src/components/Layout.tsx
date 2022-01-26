import { Modal } from '@mantine/core';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useState } from 'react';
import {
    ImhoUser,
    MeDocument,
    MeQuery,
    useMeQuery,
} from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import { Navbar } from './Navbar';
import { SessionForm } from './SessionForm';

type LayoutProps = {
    children: JSX.Element | JSX.Element[];
    user: Partial<ImhoUser> | null;
};

export const Layout = ({ children }: LayoutProps) => {
    const { data } = useMeQuery();

    const [loggedIn, setIsLoggedIn] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleLoginLogout = () => {
        if (!loggedIn) setModalOpen(true);
        else setIsLoggedIn(false);
    };

    return (
        <>
            <Navbar onLoginLogout={handleLoginLogout} isLoggedIn={loggedIn} />
            <main>
                <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
                    <SessionForm />
                </Modal>
                {children}
            </main>
        </>
    );
};

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext): Promise<
    GetServerSidePropsResult<LayoutProps>
> => {
    const apollo = initializeApollo({
        headers: req.headers,
    });
    const meQuery = await apollo.query<MeQuery>({
        query: MeDocument,
    });

    if (meQuery.data.me.result) {
        return {
            props: {
                user: meQuery.data.me.result,
                children: [],
            },
        };
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/diver',
            },
        };
    }
};
