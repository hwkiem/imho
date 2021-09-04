import { registerEnumType } from 'type-graphql';

export enum StoveType {
    GAS = 'GAS',
    ELECTRIC = 'ELECTRIC',
}

registerEnumType(StoveType, {
    name: 'StoveType',
    description: 'Stove options',
});
