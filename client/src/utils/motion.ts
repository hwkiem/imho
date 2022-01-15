import { Button, ButtonProps, Container, ContainerProps } from '@mantine/core';
import { motion } from 'framer-motion';

export const MotionContainer = motion<ContainerProps>(Container);
export const MotionButton = motion<ButtonProps<'button'>>(Button);
