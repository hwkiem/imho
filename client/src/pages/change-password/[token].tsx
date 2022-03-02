import { Container } from '@mantine/core';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { ChangePasswordForm } from '../../components/ChangePasswordForm';
import useAuth from '../../lib/useAuth';
import { MotionContainer } from '../../utils/motion';

export default function ChangePasswordPage() {
    const router = useRouter();

    let token = null;
    if (typeof router.query.token !== 'string') {
        router.push('/error');
    } else {
        token = router.query.token;
    }

    if (!token) {
        router.push('/error');
    }

    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    if (token)
        return (
            <MotionContainer
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ type: 'spring' }}
            >
                <ChangePasswordForm token={token} />
            </MotionContainer>
        );
    else {
        return <>Ooops...</>;
    }
}

ChangePasswordPage.requireAuth = false;

// override layout prop for login page
ChangePasswordPage.getLayout = function getLayout(page: ReactElement) {
    return <Container mt={200}>{page}</Container>;
};
