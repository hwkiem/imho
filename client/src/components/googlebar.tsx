import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { usePlacesWidget } from 'react-google-autocomplete';

interface GoogleBarProps {
    onSelect: (placeid: string | undefined) => void;
}

export const GoogleBar: React.FC<GoogleBarProps> = ({ onSelect }) => {
    // autocomplete widget
    const { ref } = usePlacesWidget<HTMLInputElement>({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        onPlaceSelected: (place) => {
            console.log(place.place_id);
            onSelect(place.place_id);
        },
        options: {
            types: ['address'],
        },
    });

    return (
        <InputGroup
            bg={'gray.100'}
            px={4}
            boxShadow={'2xl'}
            rounded={'md'}
            size={'lg'}
            w={'200%'}
        >
            <InputLeftElement pointerEvents="none">
                <SearchIcon color="pink.300" />
            </InputLeftElement>
            <Input variant={'flushed'} ref={ref} />
        </InputGroup>
    );
};
