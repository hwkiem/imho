import { Center, Container, Text, TextInput, Title } from '@mantine/core';
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
                sx={{ fontSize: 80, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                You've got questions,{' '}
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
                align="left"
                size="lg"
                sx={{ maxWidth: 580 }}
                mx="auto"
                mt="xl"
            >
                How is the water pressure? Is the light in the kitchen good for
                my food instagram? Will I get my security deposit back?
                <br /> <br /> These are some of the concerns we face while
                searching for a new place to call home.{' '}
                <Text
                    inherit
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'lime', deg: 45 }}
                    component="span"
                >
                    IMHO
                </Text>{' '}
                is a centralized database of honest reviews from tenants focused
                on improving accountability in the rental market. See what
                people really think of that apartment you're looking at!
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
