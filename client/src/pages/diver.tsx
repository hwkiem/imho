import { Residence } from 'entities'
import { GetServerSidePropsContext } from 'next'
import { Layout } from '../components/layout/layout'
import SimpleSidebar from '../components/section/sidebar'
import { Map } from '../components/ui/map'
import { ResidenceCard } from '../components/ui/residenceCard'
import {
    GetResidencesLimitDocument,
    GetResidencesLimitQuery,
    MeDocument,
    MeQuery,
    RegularResidenceFragment,
} from '../generated/graphql'
import { initializeApollo } from '../lib/apollo'
import { Page } from '../types/page'
import { GetServerSidePropsResult } from 'next'
import { useState, useEffect } from 'react'
import { useIsAuth } from '../utils/useIsAuth'

interface DiverProps {
    residences: RegularResidenceFragment[]
}

const Diver: Page<DiverProps> = ({ residences }) => {
    useIsAuth()
    let [center, setCenter] = useState({
        lat: 40.7969087,
        lng: -73.96190469999999,
    })
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                })
                setLoading(false)
            },
            (err) => {
                console.log(err)
                setLoading(false)
            }
        )
    }, [])

    const [hover, setHover] = useState(-1)
    return (
        <>
            <SimpleSidebar>
                {residences.map((res) => (
                    <ResidenceCard
                        key={res.res_id}
                        residence={res}
                        hover={res.res_id == hover}
                        setHover={setHover}
                    />
                ))}
            </SimpleSidebar>
            {!loading && (
                <Map
                    residences={residences}
                    center={center}
                    hover={hover}
                    setHover={setHover}
                />
            )}
        </>
    )
}

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext): Promise<
    GetServerSidePropsResult<DiverProps>
> => {
    const apollo = initializeApollo({
        headers: req.headers,
    })
    const meQuery = await apollo.query<MeQuery>({
        query: MeDocument,
    })
    if (meQuery.data.me.errors) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        }
    }
    const resQuery = await apollo.query<GetResidencesLimitQuery>({
        query: GetResidencesLimitDocument,
        variables: { limit: 10 },
    })
    if (resQuery.data.getResidencesLimit) {
        // Query completed successfully
        const result = resQuery.data.getResidencesLimit
        if (result.errors) {
            console.log('Error querying residences...')
            console.log(result.errors)
        } else if (result.residences) {
            return {
                props: {
                    residences: result.residences,
                },
            }
        }
    }
    // Query failed due to network or graphql errors
    return {
        props: {
            residences: [],
        },
    }
}

Diver.layout = Layout

export default Diver
