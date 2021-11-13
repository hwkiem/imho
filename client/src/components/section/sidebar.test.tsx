import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './sidebar';

describe('Sidebar', () => {
    it('renders a heading', () => {
        render(
            <Sidebar>
                <div />
            </Sidebar>
        );
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('has a refresh button', () => {
        render(
            <Sidebar>
                <div />
            </Sidebar>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders its children', () => {
        render(
            <Sidebar>
                <div data-testid="my-child" />
            </Sidebar>
        );
        expect(screen.getByTestId('my-child')).toBeInTheDocument();
    });
});
