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
    ID = 'res_id',
}

registerEnumType(ResidenceSortBy, {
    name: 'ResidenceSortBy',
    description: 'Field by which to sort residence query results',
});

export enum ReviewSortBy {
    RENT = 'rating',
    RATING = 'rating',
    USER_ID = 'res_id',
}

registerEnumType(ReviewSortBy, {
    name: 'ReviewSortBy',
    description: 'Field by which to sort review query results',
});

// placeholder for now if we add quant fields
export enum UserSortBy {
    ID = 'user_id',
}

registerEnumType(UserSortBy, {
    name: 'UserSortBy',
    description: 'Field by which to sort user query results',
});
