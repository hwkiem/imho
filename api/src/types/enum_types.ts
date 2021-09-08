import { registerEnumType } from 'type-graphql';

export enum StoveType {
    GAS = 'GAS',
    ELECTRIC = 'ELECTRIC',
}

registerEnumType(StoveType, {
    name: 'StoveType',
    description: 'Stove options',
});

export enum LaundryType {
    IN_UNIT = 'IN_UNIT',
    BUILDING = 'BUILDING',
    NONE = 'NONE',
}

registerEnumType(LaundryType, {
    name: 'LaundryType',
    description: 'Laundry options',
});

export enum QueryOrderChoice {
    ASC = 'acs',
    DESC = 'desc',
}

registerEnumType(QueryOrderChoice, {
    name: 'QueryOrderChoice',
    description: 'OrderBy options',
});

export enum ResidenceSortBy {
    RENT = 'avg_rent',
    RATING = 'avg_rating',
    ID = 'xyz_residences.res_id',
}

registerEnumType(ResidenceSortBy, {
    name: 'ResidenceSortBy',
    description: 'Field by which to sort query results',
});
