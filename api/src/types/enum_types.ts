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

export enum LocationSortBy {
    RENT = 'avg_rent',
    RATING = 'avg_rating',
    ID = 'loc_id',
}

registerEnumType(LocationSortBy, {
    name: 'LocationSortBy',
    description: 'Field by which to sort location query results',
});

export enum ReviewSortBy {
    RENT = 'rating',
    RATING = 'rating',
    USER_ID = 'res_id',
    LEASE_TERM = 'lease_term',
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

export enum FlagTypes {
    RED = 'RED',
    GREEN = 'GREEN',
}

registerEnumType(FlagTypes, {
    name: 'FlagTypes',
    description: 'Types of flags assigned to an apartment',
});

export enum GreenFlags {
    LIGHT = 'light',
    REPONSIVENESS = 'responsiveness',
    PRIVACY = 'privacy',
    WATER_PRESSURE = 'water_pressure',
    TEMP_CONTROL = 'temp_control',
    NEIGHBORHOOD = 'neightborhood',
    SAFE = 'safe',
    APPLIANCES = 'appliances',
}

registerEnumType(GreenFlags, {
    name: 'GreenFlags',
    description: 'Things someone liked about their place',
});

export enum RedFlags {
    SMELL = 'smell',
    SAFETY_DEPOSIT = 'safety_deposit',
    NOISE = 'noise',
    PESTS = 'pests',
    MOLD = 'mold',
    WATER_PRESSURE = 'water_pressure',
    PRIVACY = 'privacy',
    UNRESPONSIVE = 'unresponsive',
    TEMP_CONTROL = 'temp_control',
}

registerEnumType(RedFlags, {
    name: 'RedFlags',
    description: 'Things someone disliked about their place',
});

export enum LocationCategory {
    HOUSE = 'HOUSE',
    APARTMENT_BUILDING = 'APARTMENT',
}

registerEnumType(LocationCategory, {
    name: 'LocationCategory',
    description: 'Two categories of location - single or multi residence',
});
