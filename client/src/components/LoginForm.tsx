import {
    Button,
    Center,
    Grid,
    TextInput,
    Title,
    Text,
    LoadingOverlay,
} from '@mantine/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import { LoginInput } from '../generated/graphql';
import { SchemaOf, object, string } from 'yup';
import useAuth from '../lib/useAuth';
import { AutoErrorInjection } from './SessionModal';
import { useRouter } from 'next/router';

export const LoginForm = () => {
    // initial state is undefined
    const initial: LoginInput = {
        email: '',
        password: '',
    };

    const router = useRouter();

    // validation schema for logging in
    const loginSchema: SchemaOf<LoginInput> = object().shape({
        email: string().email().required(),
        password: string().min(8).required(),
    });

    // using login auth context function
    const { login, loading } = useAuth();

    return (
        <>
            <Title
                sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}
                align="center"
            >
                Login to{' '}
                <Text
                    inherit
                    variant={'gradient'}
                    gradient={{ from: 'pink', to: 'lime', deg: 45 }}
                    component={'span'}
                >
                    IMHO
                </Text>{' '}
            </Title>
            <Formik
                initialValues={initial}
                validationSchema={loginSchema}
                onSubmit={async (values) => {
                    login({
                        email: values.email,
                        password: values.password,
                    });
                }}
            >
                {({ handleSubmit, isSubmitting }) => {
                    return (
                        <>
                            <LoadingOverlay visible={isSubmitting} />
                            <Form onSubmit={handleSubmit}>
                                <AutoErrorInjection />
                                <Grid justify={'center'} gutter={'xl'}>
                                    <Grid.Col span={12}>
                                        <Field name={'email'}>
                                            {({ field, meta }: FieldProps) => (
                                                <TextInput
                                                    {...field}
                                                    error={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                    label={'email'}
                                                    type={'email'}
                                                    placeholder={
                                                        'chilipepperpete@imho.com'
                                                    }
                                                    required
                                                    disabled={loading}
                                                />
                                            )}
                                        </Field>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Field name={'password'}>
                                            {({ field, meta }: FieldProps) => (
                                                <TextInput
                                                    {...field}
                                                    error={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                    label={'password'}
                                                    type={'password'}
                                                    placeholder={'iloveimho!'}
                                                    required
                                                    disabled={loading}
                                                />
                                            )}
                                        </Field>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Center>
                                            <Button
                                                type={'submit'}
                                                variant={'gradient'}
                                                gradient={{
                                                    from: 'pink',
                                                    to: 'lime',
                                                    deg: 35,
                                                }}
                                                size={'md'}
                                            >
                                                Login
                                            </Button>
                                        </Center>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Center>
                                            <Button
                                                variant={'subtle'}
                                                size={'xs'}
                                                onClick={() =>
                                                    router.push(
                                                        '/forgot-password'
                                                    )
                                                }
                                            >
                                                Forgot Password
                                            </Button>
                                        </Center>
                                    </Grid.Col>
                                </Grid>
                            </Form>
                        </>
                    );
                }}
            </Formik>
        </>
    );
};
