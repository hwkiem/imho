import { Text, Title } from '@mantine/core';
import { Variants } from 'framer-motion';
import {} from 'next';
import { useRouter } from 'next/router';
import { useGetPlaceQuery } from '../../generated/graphql';
import { MotionContainer } from '../../utils/motion';

export default function PlacePage() {
    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    const router = useRouter();

    let placeId = '';

    if (typeof router.query.pid === 'string') {
        placeId = router.query.pid;
    } else {
        console.log('incorrect query string...');
    }

    const { data, loading, error } = useGetPlaceQuery({
        variables: { placeId: placeId },
    });

    console.log(data);

    return loading ? (
        <></>
    ) : data?.getPlace.result ? (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <Text
                sx={{ fontSize: 50, fontWeight: 700, letterSpacing: -2 }}
                align="center"
                mt={100}
                variant="gradient"
                gradient={{ from: 'green', to: 'purple', deg: 45 }}
            >
                {data.getPlace.result.formatted_address}
            </Text>
        </MotionContainer>
    ) : (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <Title
                sx={{ fontSize: 100, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                Address not found.
            </Title>
        </MotionContainer>
    );
}
