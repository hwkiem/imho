import { Page } from '../types/page';
import { useIsAuth } from '../utils/useIsAuth';

const Index: Page = () => {
    useIsAuth();
    return <div>loading...</div>;
};

export default Index;
