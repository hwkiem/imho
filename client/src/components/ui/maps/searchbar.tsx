import { SearchIcon } from '@chakra-ui/icons'
import {
    chakra,
    Box,
    Center,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
} from '@chakra-ui/react'
import { Fragment, useEffect } from 'react'
import { RiHomeSmileFill } from 'react-icons/ri'

const HomeIcon = chakra(RiHomeSmileFill)

interface SearchBarProps {
    options: google.maps.places.AutocompleteOptions
}

export const SearchBar: React.FC<SearchBarProps> = ({ options }) => {
    let auto: google.maps.places.Autocomplete

    const eventHandler = () => {
        console.log('!')
    }

    const setInputRef = (node: HTMLInputElement) => {
        auto = new google.maps.places.Autocomplete(node, options)
        auto.addListener('places_changed', () => {
            console.log('!')
        })
    }

    // Update the bounds of the autocomplete
    useEffect(() => {
        auto.setBounds(options.bounds)
    }, [options.bounds])

    return (
        <Box w={'100%'} position={'absolute'} zIndex={'2'} top={20}>
            <Center>
                <InputGroup
                    mt={20}
                    bg={'gray.100'}
                    px={4}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    zIndex={2}
                    w={'30%'}
                >
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input variant={'flushed'} as={'input'} ref={setInputRef} />
                </InputGroup>
            </Center>
        </Box>
    )
}
