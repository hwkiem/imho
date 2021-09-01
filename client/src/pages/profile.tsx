import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Layout } from '../components/layout/layout';
import { MeDocument, MeQuery, RegularUserFragment } from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import { Page } from '../types/page';
import { useIsAuth } from '../utils/useIsAuth';

interface ProfileProps {
    me: RegularUserFragment;
}

const Profile: Page<ProfileProps> = ({ me }) => {
    useIsAuth();
    return <div>Hello {me.first_name}!</div>;
};

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext): Promise<
    GetServerSidePropsResult<ProfileProps>
> => {
    const apollo = initializeApollo({
        headers: req.headers,
    });
    const meQuery = await apollo.query<MeQuery>({
        query: MeDocument,
    });
    if (meQuery.data.me.errors) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    } else if (meQuery.data.me.users) {
        return {
            props: {
                me: meQuery.data.me.users[0],
            },
        };
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/error',
            },
        };
    }
};

Profile.layout = Layout;

export default Profile;
