import { Center, Text, TextInput, Title } from '@mantine/core';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import { SuggestionList } from '../components/SuggestionList';
import { MotionContainer } from '../utils/motion';

export default function SearchPage() {
    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    const [address, setAddress] = useState('');
    const router = useRouter();

    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <Title
                sx={{ fontSize: 60, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={50}
            >
                You've got questions,<br></br>
                <Text
                    inherit
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'lime', deg: 45 }}
                    component="span"
                >
                    IMHO
                </Text>{' '}
                has answers.
            </Title>
            <Text
                color="dimmed"
                align="center"
                sx={{ maxWidth: 580, fontSize: 30 }}
                mx="auto"
                mt="sm"
            >
                Do your homework. Read reviews before renting.
            </Text>
            <Center>
                <TextInput
                    mt={20}
                    size="xl"
                    sx={{ width: '80%' }}
                    icon={<FaSearchLocation size={16} />}
                    placeholder="123 Mushroom Road, Davis, CA"
                    variant="default"
                    value={address}
                    label={'Enter an address'}
                    onChange={(evt) => {
                        setAddress(evt.currentTarget.value);
                    }}
                    autoFocus
                />
            </Center>
            <SuggestionList
                hidden={false}
                address={address}
                onSelect={(place) => {
                    setAddress(place.description);
                    router.push(`/place/${place.place_id}`);
                }}
                key={'suggestions'}
            />
        </MotionContainer>
    );
}
