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
