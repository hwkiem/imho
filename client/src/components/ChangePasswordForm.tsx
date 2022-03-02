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
    ChangePasswordMutationVariables,
    ForgotPasswordMutationVariables,
    useChangePasswordMutation,
    useForgotPasswordMutation,
} from '../generated/graphql';
import { SchemaOf, object, string, ref } from 'yup';
import { AutoErrorInjection } from './SessionModal';
import { useRouter } from 'next/router';
import useAuth from '../lib/useAuth';
import { useEffect } from 'react';

interface ChangePasswordFormProps {
    token: string;
}

export const ChangePasswordForm = ({ token }: ChangePasswordFormProps) => {
    // initial state is undefined
    const initial: ChangePasswordMutationVariables = {
        newPassword: '',
        token: token,
    };

    const router = useRouter();

    // validation schema for logging in
    const changePasswordSchema: SchemaOf<ChangePasswordMutationVariables> =
        object().shape({
            newPassword: string().min(8).required(),
            passwordConfirm: string().oneOf(
                [ref('newPassword'), null],
                'Passwords must match'
            ),
            token: string().required(),
        });

    const { changePasswordHandler, loading, user } = useAuth();

    useEffect(() => {
        if (user) router.push('/');
    }, [user]);

    return (
        <>
            <Title
                sx={{ fontSize: 20, fontWeight: 300, marginBottom: 10 }}
                align="center"
            >
                Let's update your{' '}
                <Text
                    inherit
                    variant={'gradient'}
                    gradient={{ from: 'pink', to: 'lime', deg: 45 }}
                    component={'span'}
                >
                    IMHO
                </Text>{' '}
                password.
            </Title>
            <Formik
                initialValues={initial}
                validationSchema={changePasswordSchema}
                onSubmit={async (values) => {
                    changePasswordHandler(
                        {
                            newPassword: values.newPassword,
                            token: token,
                        },
                        () => router.push('/change-password/expired')
                    );
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
                                        <Field name={'newPassword'}>
                                            {({ field, meta }: FieldProps) => (
                                                <TextInput
                                                    {...field}
                                                    error={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                    label={'New Password'}
                                                    type={'password'}
                                                    required
                                                    disabled={loading}
                                                />
                                            )}
                                        </Field>
                                        <Field name={'passwordConfirm'}>
                                            {({ field, meta }: FieldProps) => (
                                                <TextInput
                                                    {...field}
                                                    error={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                    label={
                                                        'Confirm New Password'
                                                    }
                                                    type={'password'}
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
