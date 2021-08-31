import { Box } from '@chakra-ui/react'
import { Map } from '../components/ui/maps/map'
import { Page } from '../types/page'

const MapPage: Page = () => {
    return (
        <Box h={'100vh'} w={'100vw'}>
            <Map withSearchBar />
        </Box>
    )
}

export default MapPage
