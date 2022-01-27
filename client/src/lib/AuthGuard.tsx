// AuthGuard.tsx
import useAuth from './useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function AuthGuard({
    children,
    guard = true,
}: {
    children: JSX.Element;
    guard?: boolean;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && guard) {
            //auth is initialized and there is no user
            if (!user) {
                // redirect
                router.replace(`/login?next=${router.route}`);
            }
        }
    }, [user, guard, loading, router]);

    /* show loading indicator while the auth provider is still loadingInitial */
    if (loading && guard) {
        return <></>;
    }

    // if auth initialized with a valid user show protected page
    if (!guard || (!loading && user)) {
        return <>{children}</>;
    }

    /* otherwise don't return anything, will do a redirect from useEffect */
    return null;
}
