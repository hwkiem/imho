import { registerEnumType } from 'type-graphql';
import {
    ConFlagType,
    DbkFlagType,
    ProFlagType,
} from '../utils/enums/FlagType.enum';
import { UserRoles } from '../utils/enums/UserRoles';

const registerTypegraphqlEnums = () => {
    registerEnumType(ProFlagType, {
        name: 'ProFlagTypes',
        description: 'All the positive flag topics',
    });

    registerEnumType(DbkFlagType, {
        name: 'DbkFlagTypes',
        description: 'All the dealbreakers',
    });

    registerEnumType(ConFlagType, {
        name: 'ConFlagTypes',
        description: 'All the negative flag topics',
    });

    registerEnumType(UserRoles, {
        name: 'UserRoles',
        description: 'Users are admin or normal privilege',
    });
};

export default registerTypegraphqlEnums;
