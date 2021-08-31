import { ChakraProps } from '@chakra-ui/react'
import { Fragment } from 'react'
import { RegularResidenceFragment } from '../../../generated/graphql'

interface SideBarProps extends ChakraProps {
    residences: RegularResidenceFragment[]
}

export const SideBar: React.FC<SideBarProps> = () => {
    return <Fragment>hello</Fragment>
}
