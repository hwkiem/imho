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

    const setInputRef = (node: HTMLInputElement) => {
        auto = new google.maps.places.Autocomplete(node, options)
    }

    // Update the bounds of the autocomplete
    useEffect(() => {
        auto.setBounds(options.bounds)
    }, [options.bounds])

    return (
        <Box w={'100%'} position={'absolute'} zIndex={'2'} top={20}>
            <Center>
                <Box bg={'white'} rounded={'md'} p={2} w={'30%'}>
                    <InputGroup>
                        <InputLeftElement>
                            <Icon as={HomeIcon} />
                        </InputLeftElement>
                        <Input
                            variant={'flushed'}
                            ref={setInputRef}
                            size={'sm'}
                            padding={6}
                        />
                    </InputGroup>
                </Box>
            </Center>
        </Box>
    )
}
