import { Box, Center, Input } from '@chakra-ui/react'
import { Fragment, useEffect } from 'react'

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
        <Center zIndex={2}>
            <Box bg={'white'}>
                <Input variant={'flushed'} ref={setInputRef} />
            </Box>
        </Center>
    )
}
