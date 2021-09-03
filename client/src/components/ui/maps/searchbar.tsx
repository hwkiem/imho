import { SearchIcon } from '@chakra-ui/icons';
import {
    chakra,
    Box,
    Center,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { Fragment, useEffect } from 'react';
import { RiHomeSmileFill } from 'react-icons/ri';

const HomeIcon = chakra(RiHomeSmileFill);

interface SearchBarProps {
    options: google.maps.places.AutocompleteOptions;
    searchHandler: (place: google.maps.places.PlaceResult) => void;
    variant?: 'small' | 'large';
}

export const SearchBar: React.FC<SearchBarProps> = ({
    options,
    searchHandler,
    variant,
}) => {
    const setInputRef = (node: HTMLInputElement) => {
        const auto = new google.maps.places.Autocomplete(node, options);
        console.log(auto);
        auto.addListener('place_changed', () => {
            searchHandler(auto.getPlace());
        });
    };

    return (
        <InputGroup
            position={'absolute'}
            zIndex={2}
            left={'50%'}
            style={{ transform: 'translate(-50%, -50%)' }}
            mt={variant == 'small' ? '5%' : '10%'}
            bg={'gray.100'}
            px={4}
            boxShadow={'2xl'}
            rounded={'md'}
            w={variant == 'small' ? '80%' : '30%'}
        >
            <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input variant={'flushed'} as={'input'} ref={setInputRef} />
        </InputGroup>
    );
};
