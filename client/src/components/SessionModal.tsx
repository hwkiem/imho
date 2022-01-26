import { Divider, LoadingOverlay, Modal, ModalProps } from '@mantine/core';
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import useAuth from '../lib/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AutoErrorInjection = () => {
    const { errors } = useAuth();

    const { setErrors } = useFormikContext();

    useEffect(() => {
        if (errors) {
            const initErrors: { [key: string]: string } = {};
            const formikErrors = errors.reduce((prev, cur) => {
                prev[cur.field] = cur.error;
                return prev;
            }, initErrors);
            setErrors(formikErrors);
        }
    }, [errors, setErrors]);

    return null;
};

const SessionModal = ({ opened, onClose }: ModalProps) => {
    const { loading } = useAuth();

    return (
        <Modal opened={opened} onClose={onClose}>
            <LoadingOverlay visible={loading} />
            <LoginForm />
            <Divider my="xs" label="or" labelPosition="center" />
            <RegisterForm />
        </Modal>
    );
};

export default SessionModal;
