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
import {
    ForgotPasswordMutationVariables,
    useForgotPasswordMutation,
} from '../generated/graphql';
import { SchemaOf, object, string } from 'yup';
import { AutoErrorInjection } from './SessionModal';
import router from 'next/router';
import { useState } from 'react';

export const ForgotPasswordForm = () => {
    // initial state is undefined
    const initial: ForgotPasswordMutationVariables = {
        email: '',
    };

    // validation schema for logging in
    const forgotPasswordSchema: SchemaOf<ForgotPasswordMutationVariables> =
        object().shape({
            email: string().email().required(),
        });

    const [forgotPassword, { loading }] = useForgotPasswordMutation();
    const [successful, setSuccessful] = useState(false);

    return successful ? (
        <>
            <Title
                sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}
                align="center"
            >
                Check your inbox for a password reset link from{' '}
                <Text
                    inherit
                    variant={'gradient'}
                    gradient={{ from: 'pink', to: 'lime', deg: 45 }}
                    component={'span'}
                >
                    imho.teams@gmail.com.
                </Text>{' '}
                Try again in 5 minutes if you don't hear from us!
            </Title>
        </>
    ) : (
        <>
            <Title
                sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}
                align="center"
            >
                Forgot your{' '}
                <Text
                    inherit
                    variant={'gradient'}
                    gradient={{ from: 'pink', to: 'lime', deg: 45 }}
                    component={'span'}
                >
                    IMHO
                </Text>{' '}
                password? No worries! We'll send you a link.
            </Title>
            <Formik
                initialValues={initial}
                validationSchema={forgotPasswordSchema}
                onSubmit={async (values, { setErrors }) => {
                    const results = await forgotPassword({
                        variables: { email: values.email },
                    });
                    if (results.data?.forgotPassword.result) {
                        setSuccessful(true);
                    } else {
                        if (
                            results.data?.forgotPassword.errors &&
                            results.data?.forgotPassword.errors[0].field ==
                                'email'
                        ) {
                            setErrors({
                                email: results.data.forgotPassword.errors[0]
                                    .error,
                            });
                        } else {
                            setErrors({
                                email: 'Something went wrong... Please try again later or contact support.',
                            });
                        }
                    }
                }}
            >
                {({ handleSubmit, isSubmitting }) => {
                    return (
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
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                    label={'email'}
                                                    type={'email'}
                                                    placeholder={
                                                        'chilipepperpete@imho.com'
                                                    }
                                                    required
                                                    disabled={isSubmitting}
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
                                                mb={10}
                                            >
                                                Submit
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
