import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { MeDocument, MeQuery } from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import { Page } from '../types/page';
import { useIsAuth } from '../utils/useIsAuth';

const Index: Page = () => {
    useIsAuth();
    return <div>loading...</div>;
};

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> => {
    const apollo = initializeApollo({
        headers: req.headers,
    });
    const meQuery = await apollo.query<MeQuery>({
        query: MeDocument,
    });

    console.log(meQuery.data.me.users);

    if (meQuery.data.me.errors) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/diver',
            },
        };
    }
};

export default Index;