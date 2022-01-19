/**
 * This file contains the definitions for all flag types.
 *
 * The goal is to have these enums propagate all the way to
 * the client
 */

export enum ProFlagType {
    PET_FRIENDLY = 'pet friendly',
    STORAGE = 'storage',
    SHOWER = 'shower',
    NATURAL_LIGHT = 'natural light',
    NEIGHBORHOOD = 'neighborhood',
    AMENITIES = 'amenities',
    APPLIANCES = 'appliances',
    GOOD_LANDLORD = 'nice landlord',
}

export enum ConFlagType {
    BAD_LANDLORD = 'bad landlord',
    UNSAFE = 'unsafe',
    PET_UNFRIENDLY = 'pet unfriendly',
    SHOWER = 'shower',
    FALSE_AD = 'false advertisement',
    MOLD_MILDEW = 'mold or mildew',
    PESTS = 'pests',
    NOISE = 'noise',
    MAINTENANCE = 'maintenance issues',
    CONNECTIVITY = 'cell / wifi connectivity',
}

export enum DbkFlagType {
    LEASE = 'lease issues',
    BURGLARY = 'burglary',
    MUSHROOM = 'illegal mushroom activity',
    DEPOSIT = 'security deposit',
    CONSTRUCTION = 'construction harrasment',
    PRIVACY = 'privacy',
    UNRESPONSIVE = 'unresponsive',
}
