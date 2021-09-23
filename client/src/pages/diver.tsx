import { Layout } from '../components/layout/layout';
import { Map } from '../components/maps/map';
import { RegularResidenceFragment } from '../generated/graphql';
import { Page } from '../types/page';
interface DiverProps {
    residences: RegularResidenceFragment[];
}

const Diver: Page<DiverProps> = () => {
    return (
        <Map
            withResidences
            withSideBar
            variant="large"
            withSearchBar
            searchTypes={['geocode']}
        />
    );
};

Diver.layout = Layout;

export default Diver;
