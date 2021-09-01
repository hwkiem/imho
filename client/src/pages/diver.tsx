import { Residence } from 'entities'
import { GetServerSidePropsContext } from 'next'
import { Layout } from '../components/layout/layout'
import SimpleSidebar from '../components/section/sidebar'
import { Map } from '../components/ui/maps/map'
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

const Diver: Page<DiverProps> = () => {
    useIsAuth()
    return (
        <Map
            withResidences
            withSideBar
            variant="large"
            withSearchBar
            searchTypes={['geocode']}
        />
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
