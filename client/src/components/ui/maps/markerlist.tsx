import { Fragment } from 'react'
import {
    RegularResidenceFragment,
    ResidenceGql,
} from '../../../generated/graphql'
import { Marker } from './marker'

interface MarkerListProps {
    residences: RegularResidenceFragment[]
}

export const MarkerList: React.FC<MarkerListProps> = ({ residences }) => {
    return (
        <Fragment>
            {residences.map((res) => (
                <Marker {...res.coords} />
            ))}
        </Fragment>
    )
}
