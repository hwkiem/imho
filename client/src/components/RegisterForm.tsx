import {
    Button,
    Center,
    Divider,
    Grid,
    TextInput,
    Title,
    Text,
    LoadingOverlay,
} from '@mantine/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import { SchemaOf, object, string, ref } from 'yup';
import { RegisterInput, useRegisterUserMutation } from '../generated/graphql';
import useAuth from '../lib/useAuth';
import { AutoErrorInjection } from './SessionModal';

export const RegisterForm = () => {
    // initial state is undefined
    const initial: RegisterInput & { passwordConfirm: string } = {
        email: '',
        password: '',
        passwordConfirm: '',
    };

    // validation schema for registering
    const registerSchema: SchemaOf<RegisterInput> = object().shape({
        email: string().email().required(),
        password: string().min(8).required(),
        passwordConfirm: string().oneOf(
            [ref('password'), null],
            'Passwords must match'
        ),
    });

    // using register auth context function
    const { register, errors } = useAuth();

    return (
        <>
            <Title sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}>
                Register to{' '}
                <Text
                    inherit
                    variant={'gradient'}
                    gradient={{ from: 'pink', to: 'lime', deg: 45 }}
                    component={'span'}
                >
                    IMHO
                </Text>{' '}
                to save reviews, get notified about potential apartments, and
                build a profile.
            </Title>
            <Formik
                initialValues={initial}
                validationSchema={registerSchema}
                onSubmit={async (values) => {
                    register({
                        email: values.email,
                        password: values.password,
                    });
                }}
            >
                {({ handleSubmit, isSubmitting }) => (
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
                                                    meta.touched && meta.error
                                                }
                                                label={'email'}
                                                type={'email'}
                                                placeholder={
                                                    'chilipepperpete@imho.com'
                                                }
                                                required
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
                                                    meta.touched && meta.error
                                                }
                                                label={'password'}
                                                type={'password'}
                                                placeholder={'iloveimho!'}
                                                required
                                            />
                                        )}
                                    </Field>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <Field name={'passwordConfirm'}>
                                        {({ field, meta }: FieldProps) => (
                                            <TextInput
                                                {...field}
                                                error={
                                                    meta.touched && meta.error
                                                }
                                                label={'confirm password'}
                                                type={'password'}
                                                required
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
                                                to: 'purple',
                                                deg: 35,
                                            }}
                                            size={'md'}
                                        >
                                            Register
                                        </Button>
                                    </Center>
                                </Grid.Col>
                            </Grid>
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};
