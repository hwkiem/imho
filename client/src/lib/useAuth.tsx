import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    FieldError,
    ImhoUser,
    LoginInput,
    RegisterInput,
    useLoginMutation,
    useLogoutMutation,
    useMeLazyQuery,
    useRegisterUserMutation,
} from '../generated/graphql';
import { useRouter } from 'next/router';

interface AuthContextType {
    user?: Pick<ImhoUser, 'email' | 'id'>;
    loading: boolean;
    errors?: FieldError[];
    login: (input: LoginInput, cb?: () => void) => void;
    register: (input: RegisterInput, cb?: () => void) => void;
    logout: (cb?: () => void) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}): JSX.Element {
    // managing context state
    const [user, setUser] = useState<Pick<ImhoUser, 'email' | 'id'>>();
    const [errors, setErrors] = useState<FieldError[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

    // router for resetting error state on page change
    const router = useRouter();

    // hooks for api
    const [apiMe] = useMeLazyQuery();

    const [apiLogin] = useLoginMutation();
    const [apiRegister] = useRegisterUserMutation();
    const [apiLogout] = useLogoutMutation();

    // If we change page, reset the error state.
    useEffect(() => {
        if (errors) setErrors(undefined);
    }, [router.route, errors]);

    // Check if there is a currently active session
    // when the provider is mounted for the first time.
    //
    // If there is an error, it means there is no session.
    //
    // Finally, just signal the component that the initial load
    // is over.
    useEffect(() => {
        apiMe()
            .then(({ data }) => {
                if (data?.me.result) {
                    setUser(data.me.result);
                }
                if (data?.me.errors) {
                    setErrors(data.me.errors);
                }
            })
            .catch((_err) => {
                console.log('errors fetching mequery...');
                console.log(_err);
            })
            .finally(() => setLoadingInitial(false));
    }, [apiMe]);

    // Flags the component loading state and posts the login
    // data to the server.
    //
    // An error means that the email/password combination is
    // not valid.
    //
    // Finally, just signal the component that loading the
    // loading state is over.
    const login = ({ email, password }: LoginInput, onFinish?: () => void) => {
        setLoading(true);
        apiLogin({
            variables: { input: { email: email, password: password } },
        })
            .then(({ data }) => {
                if (data?.login.result) {
                    setUser(data.login.result);
                }
                if (data?.login.errors) {
                    setErrors(data.login.errors);
                }
            })
            .catch((_err) => {
                console.log(_err);
            })
            .finally(() => {
                setLoading(false);
                onFinish ? onFinish() : null;
            });
    };

    // Sends sign up details to the server. On success we just apply
    // the created user to the state.
    const register = (
        { email, password }: RegisterInput,
        onFinish?: () => void
    ) => {
        setLoading(true);
        apiRegister({
            variables: { input: { email: email, password: password } },
        })
            .then(({ data }) => {
                if (data?.registerUser.result)
                    setUser(data.registerUser.result);
                if (data?.registerUser.errors)
                    setErrors(data.registerUser.errors);
            })
            .catch((_err) => {
                console.log('errors registering...');
                console.log(_err);
            })
            .finally(() => {
                setLoading(false);
                onFinish ? onFinish() : null;
            });
    };

    // Call the logout endpoint and then remove the user
    // from the state.
    const logout = (onFinish?: () => void) => {
        setLoading(true);
        apiLogout()
            .then(({ data }) => {
                if (data?.logout) {
                    setUser(undefined);
                } else
                    setErrors([{ field: 'user', error: 'failed to log out.' }]);
            })
            .catch((_err) => {
                console.log('errors logging out...');
                console.log(_err);
            })
            .finally(() => {
                setLoading(false);
                onFinish ? onFinish() : null;
            });
    };

    // Make the provider update only when it should.
    // We only want to force re-renders if the user,
    // loading or error states change.
    //
    // Whenever the `value` passed into a provider changes,
    // the whole tree under the provider re-renders, and
    // that can be very costly! Even in this case, where
    // you only get re-renders when logging in and out
    // we want to keep things very performant.
    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            errors,
            login,
            register,
            logout,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, loading, errors]
    );

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
    return useContext(AuthContext);
}
