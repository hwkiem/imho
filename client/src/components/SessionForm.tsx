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
import React, { useEffect, useState } from 'react';
import {
    LoginInput,
    RegisterUserDocument,
    useLoginMutation,
    useMeQuery,
    useRegisterUserMutation,
    UserValidator,
} from '../generated/graphql';
import { SchemaOf, object, string, ref } from 'yup';
import { LayoutGroupContext, Variants } from 'framer-motion';

export const SessionForm = () => {
    // initial state is undefined
    const initial: Partial<LoginInput & { passwordConfirmation: string }> = {
        email: undefined,
        password: undefined,
        passwordConfirmation: undefined,
    };

    enum formTypes {
        login,
        register,
    }
    const [formType, setFormType] = useState<formTypes>(formTypes.login);

    // validation schema for logging in
    const loginSchema: SchemaOf<LoginInput> = object().shape({
        email: string().email().required(),
        password: string().required(),
    });

    const registerSchema: SchemaOf<
        LoginInput & { passwordConfirmation: string }
    > = object().shape({
        email: string().email().required(),
        password: string().min(8).required(),
        passwordConfirmation: string()
            .oneOf([ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
    });

    // using login mutation
    const [login] = useLoginMutation();
    const [register] = useRegisterUserMutation();

    return (
        <>
            {formType}
            <Title sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}>
                Login to{' '}
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
                onSubmit={async (values, { setErrors, resetForm }) => {
                    console.log('submitting...');
                    if (formType === formTypes.register) {
                        const { data, errors } = await register({
                            variables: {
                                input: { ...(values as UserValidator) },
                            },
                        });

                        if (errors) {
                            alert('graphql error...');
                            resetForm();
                            return;
                        }

                        if (data?.registerUser.errors) {
                            const initErrors: { [key: string]: string } = {};
                            const errors = data.registerUser.errors.reduce(
                                (prev, cur) => {
                                    prev[cur.field] = cur.error;
                                    return prev;
                                },
                                initErrors
                            );
                            setErrors(errors);
                            return;
                        }

                        if (data?.registerUser.result) {
                            alert(
                                `user registered. Welcome ${data.registerUser.result.email}`
                            );
                            return;
                        }
                    }
                    const { data, errors } = await login({
                        variables: {
                            input: { ...(values as LoginInput) },
                        },
                    });
                }}
                validationSchema={
                    formType === formTypes.login ? loginSchema : registerSchema
                }
            >
                {({ handleSubmit, isSubmitting }) => (
                    <>
                        <LoadingOverlay visible={isSubmitting} />
                        <Form onSubmit={handleSubmit}>
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
                                {formType === formTypes.register && (
                                    <Grid.Col span={12}>
                                        <Field name={'passwordConfirmation'}>
                                            {({ field, meta }: FieldProps) => (
                                                <TextInput
                                                    {...field}
                                                    error={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                    label={'confirm password'}
                                                    type={'password'}
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </Grid.Col>
                                )}
                                <Grid.Col span={12}>
                                    <Center>
                                        <Button
                                            type={
                                                formType === formTypes.login
                                                    ? 'submit'
                                                    : 'button'
                                            }
                                            variant={
                                                formType === formTypes.login
                                                    ? 'gradient'
                                                    : 'subtle'
                                            }
                                            gradient={{
                                                from: 'pink',
                                                to: 'purple',
                                                deg: 35,
                                            }}
                                            size={
                                                formType === formTypes.login
                                                    ? 'md'
                                                    : 'sm'
                                            }
                                            onClick={
                                                formType === formTypes.login
                                                    ? () => handleSubmit()
                                                    : () => {
                                                          setFormType(
                                                              formTypes.login
                                                          );
                                                      }
                                            }
                                        >
                                            Login
                                        </Button>
                                    </Center>
                                    <Divider
                                        my="xs"
                                        label="or"
                                        labelPosition="center"
                                    />
                                    <Center>
                                        <Button
                                            type={
                                                formType === formTypes.register
                                                    ? 'submit'
                                                    : 'button'
                                            }
                                            variant={
                                                formType === formTypes.register
                                                    ? 'gradient'
                                                    : 'subtle'
                                            }
                                            size={
                                                formType === formTypes.register
                                                    ? 'md'
                                                    : 'sm'
                                            }
                                            gradient={{
                                                from: 'pink',
                                                to: 'purple',
                                                deg: 35,
                                            }}
                                            onClick={
                                                formType === formTypes.register
                                                    ? () => handleSubmit()
                                                    : () => {
                                                          setFormType(
                                                              formTypes.register
                                                          );
                                                      }
                                            }
                                        >
                                            Sign Up
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
