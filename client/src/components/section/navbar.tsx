import { ReactNode, useRef } from 'react'
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    useDisclosure,
    useColorModeValue,
    Stack,
    chakra,
    Icon,
    Center,
    Tooltip,
    Tabs,
    Tab,
    TabList,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { RiHomeSmileFill } from 'react-icons/ri'
import { useMeQuery, useLogoutMutation } from '../../generated/graphql'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client'
import NextLink from 'next/link'

const CRiHomeSmile = chakra(RiHomeSmileFill)

const LINKS = ['diver', 'about', 'profile']

interface NavLinkProps {
    children: ReactNode
    path: string
}
const NavLink: React.FC<NavLinkProps> = ({ children, path }) => {
    return (
        <Link
            as={NextLink}
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            href={path}
        >
            {children}
        </Link>
    )
}

export const NavBar: React.FC = () => {
    const btnRef = useRef<HTMLButtonElement>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter()
    const { data, loading } = useMeQuery()
    const [logout] = useLogoutMutation()
    const client = useApolloClient()

    let user = null
    if (data?.me.users) {
        user = data.me.users[0]
    }
    return (
        <Center zIndex={10}>
            <Box
                mt={20}
                bg={'gray.100'}
                px={4}
                boxShadow={'2xl'}
                rounded={'md'}
                position={'absolute'}
                zIndex={2}
                w={'80%'}
            >
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Icon
                                as={CRiHomeSmile}
                                w={8}
                                h={8}
                                color={'teal'}
                            />
                        </Box>
                        <Tabs variant="line" colorScheme="teal">
                            <TabList>
                                {LINKS.map((link) => (
                                    <Tab key={link}>
                                        <NavLink key={link} path={`/${link}`}>
                                            {link}
                                        </NavLink>
                                    </Tab>
                                ))}
                            </TabList>
                        </Tabs>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Button
                            variant={'solid'}
                            colorScheme={'teal'}
                            size={'sm'}
                            mr={4}
                            ref={btnRef}
                            onClick={async () => {
                                console.log('!')
                                await logout()
                                await client.clearStore()
                                router.push('/login')
                            }}
                        >
                            Logout
                        </Button>
                        {user && (
                            <Tooltip
                                label={`Hello ${user.first_name} ${user.last_name}`}
                                fontSize="md"
                            >
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                            </Tooltip>
                        )}
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {LINKS.map((link) => (
                                <NavLink key={link} path={`/${link}`}>
                                    {link}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </Center>
    )
}
