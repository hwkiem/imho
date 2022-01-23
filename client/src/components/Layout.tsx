import { Modal } from '@mantine/core';
import { useState } from 'react';
import { Navbar } from './Navbar';

type LayoutProps = {
    children: JSX.Element | JSX.Element[];
};

export const Layout = ({ children }: LayoutProps) => {
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
                {' '}
                <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Log In!"
                >
                    content
                </Modal>
                {children}
            </main>
        </>
    );
};
