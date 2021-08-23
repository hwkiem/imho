import { AspectRatio, Grid, GridItem, Box } from '@chakra-ui/react'
import { Residence } from 'entities'
import { Layout } from '../components/layout/layout'
import { Map } from '../components/ui/map'

const residences: Pick<Residence, 'res_id' | 'full_address' | 'coords'>[] = [
    {
        res_id: 11,
        full_address: '18 Roosevelt Pl, Rockville Centre, NY 11570, USA',
        coords: {
            lat: 40.66482329999999,
            lng: -73.6470927,
        },
    },
    {
        res_id: 1,
        full_address: '12 W 104th St #3e, New York, NY 10025, USA',
        coords: {
            lat: 40.7969087,
            lng: -73.96190469999999,
        },
    },
]

const center = { lat: 40.7969087, lng: -73.96190469999999 }

const Index = () => {
    return (
        <Layout>
            <Map residences={residences} center={center} />
        </Layout>
    )
}

export default Index
