import { Container } from '@mantine/core';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import useAuth from '../lib/useAuth';
import { MotionContainer } from '../utils/motion';

export default function ForgotPasswordPage() {
    const { user } = useAuth();
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

    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <ForgotPasswordForm />
        </MotionContainer>
    );
}

ForgotPasswordPage.requireAuth = false;

// override layout prop for login page
ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
    return <Container mt={200}>{page}</Container>;
};
