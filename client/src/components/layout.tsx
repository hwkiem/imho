import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface LayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

const variants: Variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            staggerChildren: 0.5,
        },
    },
    exit: { opacity: 0, x: 200, y: 0 },
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div>
        <motion.main
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
        >
            {children}
        </motion.main>
    </div>
);
