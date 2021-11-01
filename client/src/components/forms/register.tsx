import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Text,
    Stack,
    useColorModeValue,
    FormErrorMessage,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import {
    useRegisterMutation,
    RegisterMutationVariables,
    RegisterInput,
    MeDocument,
    MeQuery,
} from '../../generated/graphql';
import * as yup from 'yup';
import { EntryReview } from './entryreview';

interface LoginFormProps {
    variant?: string;
}

export const RegisterForm: React.FC<LoginFormProps> = () => {
    const [stepNum, setstepNum] = useState(0);

    // Use the codegen register mutation and data state
    const [register, { error }] = useRegisterMutation();

    // Define validation schema for login form using Yup
    const validationSchema: yup.SchemaOf<
        RegisterInput & { confirm: string | undefined }
    > = yup.object({
        email: yup
            .string()
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string()
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
        confirm: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
        first_name: yup.string().required('First name is required'),
        last_name: yup.string().required('Last name is required'),
    });

    const init: RegisterMutationVariables['options'] & {
        confirm: string | undefined;
    } = {
        email: '',
        password: '',
        confirm: '',
        first_name: '',
        last_name: '',
    };

    const formik = useFormik({
        initialValues: init,
        validationSchema: validationSchema,
        onSubmit: async (
            { email, first_name, last_name, password },
            actions
        ) => {
            actions.setSubmitting(true);
            const res = await register({
                variables: {
                    options: { email, first_name, last_name, password },
                },
                update: (cache, { data }) => {
                    if (data?.register.user)
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                me: data?.register,
                            },
                        });
                },
            });

            if (res.data?.register.user) {
                setstepNum(1);
            } else if (res.data?.register.errors) {
                console.log(res.data.register.errors);
            } else if (error) {
                console.log(error);
            }
        },
    });

    const outerBg = useColorModeValue('gray.50', 'gray.800');
    const innerBg = useColorModeValue('white', 'gray.700');

    return (
        <>
            {stepNum == 0 && (
                <Flex
                    minH={'100vh'}
                    align={'center'}
                    justify={'center'}
                    bg={outerBg}
                >
                    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                        <Stack align={'center'}>
                            <Heading fontSize={'4xl'}>
                                Welcome to the family!
                            </Heading>
                            <Text fontSize={'lg'} color={'gray.600'}>
                                Create an account to enjoy all of our cool{' '}
                                <Link color={'blue.400'}>features</Link> ✌️
                            </Text>
                        </Stack>
                        <Box rounded={'lg'} bg={innerBg} boxShadow={'lg'} p={8}>
                            <Stack spacing={4}>
                                <form onSubmit={formik.handleSubmit}>
                                    <FormControl
                                        id="email"
                                        isRequired
                                        isInvalid={
                                            formik.touched.email &&
                                            Boolean(formik.errors.email)
                                        }
                                    >
                                        <FormLabel>Email address</FormLabel>
                                        <Input
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                        />
                                        <FormErrorMessage>
                                            {formik.errors.email}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="first_name"
                                        isRequired
                                        isInvalid={
                                            formik.touched.first_name &&
                                            Boolean(formik.errors.first_name)
                                        }
                                    >
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                        />
                                        <FormErrorMessage>
                                            {formik.errors.first_name}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="last_name"
                                        isRequired
                                        isInvalid={
                                            formik.touched.last_name &&
                                            Boolean(formik.errors.last_name)
                                        }
                                    >
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                        />
                                        <FormErrorMessage>
                                            {formik.errors.last_name}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        id="password"
                                        isRequired
                                        isInvalid={
                                            formik.touched.password &&
                                            Boolean(formik.errors.password)
                                        }
                                    >
                                        <FormLabel>Password</FormLabel>
                                        <FormErrorMessage>
                                            {formik.errors.password}
                                        </FormErrorMessage>
                                        <Input
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>
                                    <FormControl
                                        id="confirm"
                                        isRequired
                                        isInvalid={
                                            formik.touched.confirm &&
                                            Boolean(formik.errors.confirm)
                                        }
                                    >
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormErrorMessage>
                                            {formik.errors.confirm}
                                        </FormErrorMessage>
                                        <Input
                                            type="password"
                                            value={formik.values.confirm}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>
                                    <Stack spacing={10}>
                                        <Stack
                                            direction={{
                                                base: 'column',
                                                sm: 'row',
                                            }}
                                            align={'start'}
                                            justify={'space-between'}
                                        >
                                            <Link
                                                color={'blue.400'}
                                                href={'/login'}
                                            >
                                                Already have account?
                                            </Link>
                                        </Stack>
                                        <Button
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                            type="submit"
                                        >
                                            Create account...
                                        </Button>
                                    </Stack>
                                </form>
                            </Stack>
                        </Box>
                    </Stack>
                </Flex>
            )}
            {stepNum == 1 && <EntryReview />}
        </>
    );
};
