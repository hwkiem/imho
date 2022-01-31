import { Container } from '@mantine/core';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { RegisterForm } from '../components/RegisterForm';
import useAuth from '../lib/useAuth';
import { MotionContainer } from '../utils/motion';

export default function RegisterPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) router.push('/');
    }, [user, router]);

    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    if (user || loading) return <></>;

    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <RegisterForm />
        </MotionContainer>
    );
}

RegisterPage.requireAuth = false;

// override layout prop for login page
RegisterPage.getLayout = function getLayout(page: ReactElement) {
    return <Container mt={200}>{page}</Container>;
};
