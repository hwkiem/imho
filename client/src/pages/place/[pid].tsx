import { Title } from '@mantine/core';
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

    const { data, error } = useGetPlaceQuery({
        variables: { placeId: placeId },
    });

    console.log(data);

    return data?.getPlace.result ? (
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
                {data.getPlace.result.formatted_address}
            </Title>
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
