import { Layout } from '../components/layout/layout';
import { Map } from '../components/maps/map';
import { RegularLocationFragment } from '../generated/graphql';
import { Page } from '../types/page';
interface DiverProps {
    locations: RegularLocationFragment[];
}

const Diver: Page<DiverProps> = () => {
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
