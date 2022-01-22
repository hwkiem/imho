import { Group, Text } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { MotionButton } from '../utils/motion';

interface SuggestionListProps {
    address: string;
    onSelect: (prediction: google.maps.places.AutocompletePrediction) => void;
    hidden: boolean;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
    address,
    onSelect,
    hidden,
}: SuggestionListProps) => {
    // google search bar state management and autocomplete
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    });

    useEffect(() => {
        getPlacePredictions({
            input: address,
            types: ['address'],
        });
    }, [address]);

    const variants = {
        initial: { opacity: 0, y: 200 },
        animate: (idx: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                delay: idx * 0.2,
            },
        }),
        exit: (idx: number) => ({
            opacity: 0,
            y: 200,
            transition: {
                type: 'spring',
                delay: (5 - idx) * 0.1,
            },
        }),
    };

    const [selected, setSelected] = useState(false);

    // if hidden we don't show anything
    if (hidden) return <></>;

    return (
        <Group position="center" direction="column" mt={30}>
            <AnimatePresence>
                {!selected &&
                    placePredictions.flatMap((item, idx) => {
                        return (
                            <MotionButton
                                custom={idx}
                                variant={'outline'}
                                variants={variants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                key={idx}
                                sx={(theme) => ({
                                    root: {
                                        border: 0,
                                        height: 60,
                                        width: '100%',
                                        backgroundColor:
                                            theme.colorScheme === 'dark'
                                                ? theme.colors.dark[6]
                                                : theme.colors.gray[0],

                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark'
                                                    ? theme.colors.dark[8]
                                                    : theme.colors.gray[2],
                                        },
                                    },
                                })}
                                onClick={() => {
                                    setSelected(true);
                                    onSelect(item);
                                }}
                            >
                                <Text>{item.description}</Text>
                            </MotionButton>
                        );
                    })}
            </AnimatePresence>
        </Group>
    );
};
