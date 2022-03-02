import { Button, Center, Container, Text, Title } from '@mantine/core';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { MotionContainer } from '../../utils/motion';

export default function ExpiredTokenPage() {
    const router = useRouter();

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
        >
            {' '}
            <Title
                sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}
                align="center"
            >
                Your password reset token{' '}
                <Text
                    inherit
                    variant={'gradient'}
                    gradient={{ from: 'green', to: 'yellow', deg: 45 }}
                    component={'span'}
                >
                    expired.
                </Text>{' '}
                Click the button below for another one.
            </Title>
            <Center>
                <Button
                    onClick={() => router.push('/forgot-password')}
                    variant={'subtle'}
                >
                    Forgot Password (again)
                </Button>
            </Center>
        </MotionContainer>
    );
}

// override layout prop for login page
ExpiredTokenPage.getLayout = function getLayout(page: ReactElement) {
    return <Container mt={200}>{page}</Container>;
};
