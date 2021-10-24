import { Layout } from '../components/layout/layout';
import { Map } from '../components/maps/map';
import { RegularLocationFragment } from '../generated/graphql';
import { Page } from '../types/page';
import { useIsAuth } from '../utils/useIsAuth';
interface DiverProps {
    locations: RegularLocationFragment[];
}

const Diver: Page<DiverProps> = () => {
    useIsAuth();
    return (
        <Map
            withLocations
            withSideBar
            variant="large"
            withSearchBar
            searchTypes={['geocode']}
        />
    );
};

Diver.layout = Layout;

export default Diver;
