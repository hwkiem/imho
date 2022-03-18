import { registerEnumType } from 'type-graphql';
import {
    BathroomSubflagsCon,
    BathroomSubflagsPro,
    KitchenSubflagsPro,
    LandlordSubflagsCon,
    LandlordSubflagsPro,
    LocationSubflagsCon,
    LocationSubflagsPro,
    MaintenanceSubflagsCon,
    MiscCons,
    MiscPros,
    SmellSubflagsCon,
    UtilitiesSubflagsCon,
} from '../utils/enums/FlagType.enum';
import { UserRoles } from '../utils/enums/UserRoles';

const registerTypegraphqlEnums = () => {
    registerEnumType(UserRoles, {
        name: 'UserRoles',
        description: 'Users are admin or normal privilege',
    });
    // pros
    registerEnumType(MiscPros, {
        name: 'MiscPros',
        description: 'Pros with no category',
    });
    registerEnumType(BathroomSubflagsPro, {
        name: 'BathroomSubflagsPro',
        description: 'Bathroom pros',
    });
    registerEnumType(KitchenSubflagsPro, {
        name: 'KitchenSubflagsPro',
        description: 'Kitchen Pros',
    });
    registerEnumType(LocationSubflagsPro, {
        name: 'LocationSubflagsPro',
        description: 'Location Pros',
    });
    registerEnumType(LandlordSubflagsPro, {
        name: 'LandlordSubflagsPro',
        description: 'Landlord pros',
    });

    // cons
    registerEnumType(MiscCons, {
        name: 'MiscCons',
        description: 'Cons with no category',
    });
    registerEnumType(BathroomSubflagsCon, {
        name: 'BathroomSubflagsCon',
        description: 'Bathroom cons',
    });
    registerEnumType(MaintenanceSubflagsCon, {
        name: 'MaintenanceSubflagsCon',
        description: 'Maintenance cons',
    });
    registerEnumType(UtilitiesSubflagsCon, {
        name: 'UtilitiesSubflagsCon',
        description: 'Utilities cons',
    });
    registerEnumType(SmellSubflagsCon, {
        name: 'SmellSubflagsCon',
        description: 'Smell cons',
    });
    registerEnumType(LocationSubflagsCon, {
        name: 'LocationSubflagsCon',
        description: 'Location cons',
    });
    registerEnumType(LandlordSubflagsCon, {
        name: 'LandlordSubflagsCon',
        description: 'Landlord cons',
    });
};

export default registerTypegraphqlEnums;
