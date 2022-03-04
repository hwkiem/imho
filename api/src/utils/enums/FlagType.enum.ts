/**
 * This file contains the definitions for all flag types.
 *
 * The goal is to have these enums propagate all the way to
 * the client
 */

// Pro subflags
export enum BathroomSubflagsPro {
    WATER_PRESSURE = 'Great water pressure',
    HOT_WATER = 'Shower stays hot for days',
}

export enum KitchenSubflagsPro {
    DISHWASHER = 'Great dishwasher',
    DISPOSAL = 'Great garbage disposal',
    KITCHEN_APPLIANCES = 'Reliable kitchen appliances',
}

export enum NeighborsSubflagsPro {
    FRIENDLY = 'Friendly',
    QUIET_BLDG = 'Quiet building',
}

// Con subflags
export enum BathroomSubflagsCon {
    WATER_PRESSURE = 'The shower water pressure was weak',
    HOT_WATER = "Hot water doesn't last",
    CLOG = 'Toilet frequently clogged',
    FAN = 'No fan',
    MOLD_MILDEW = 'Mildew, mold issues',
}

export enum MaintenanceSubflagsCon {
    ELECTICAL = 'Electrical issues',
    PLUMBING = 'Plumbing issues',
    APPLIANCES = 'Appliance issues',
    PESTS = 'Pest issues',
    STRUCTURAL = 'Structural issues',
}

export enum SmellSubflagsCon {
    MOLD_MILDEW = 'Mold, mildew issues',
    TRASH = 'Trash smells',
    SMOKE = 'Smoke smells',
}

export enum NeighborsSubflagsCon {
    NOT_FRIENDLY = 'Not friendly',
    QUIET_BLDG = 'Noisy building',
}

export enum UtilitiesSubflagsCon {
    HEATING_QUAL = "Heat isn't good",
    AIRCON_QUAL = "AC isn't good",
    UTIL_COST = 'Expensive utilities',
}

export enum LocationSubflagsCon {
    NEAR_FUN = 'Not near fun things to do',
    PARKING = 'Difficult parking',
    GROCERY = 'Difficult parking',
    TRANSIT = 'Poor access to public transit',
}

export enum LandlordSubflagsCon {
    UNRESPONSIVE = 'unresponsive',
    REQUESTS = 'Did not address my requests',
    PRIVACY = 'Did not respect my privacy',
    SECURITY_DEPOSIT = 'Security deposit issues',
    LEASE_RENEWAL = 'Premature lease renewal required',
    SUBLETS = 'Landlord does not allow sublets',
    RAISE_RENT = 'Raised my rent a lot',
}

// Standalone flags, some have optional dependencies
export enum ProFlagType {
    /* Residence */
    BATHROOM = 'the Bathroom',
    KITCHEN = 'the Kitchen',
    // Lights
    NATURAL_LIGHT = 'Plenty of Natural Light',
    RELIABLE_LIGHTS = 'Reliable light fixtures',
    BRIGHT = 'No need for lamps',
    // Maintenance
    MAINTENANCE_FREQ = 'Very Few Maintenance Issues',
    MAINTENANCE_QUAL = 'Maintenance Issues handled poorly',

    AMENITIES = 'Amazing Amenities',
    POOL = 'the Pool',
    GYM = 'the Gym',
    MAILROOM = 'the Mailroom',
    OUTDOOR = 'the Outdoor Space',

    /*  Place */
    NEIGHBORS = 'my Neighbors',

    QUIET_TOWN = 'Quiet neighborhood',
    LOCATION = 'the Location',
    NEAR_FUN = 'Near restaraunts, bars',
    TRAVERSABLE = 'Walkable, bikable',
    NEAR_FOOD = 'Near a grocery store',
    NEAR_TRANSIT = 'Near public transit',

    /* Landlord */
    LANDLORD = 'my Landlord, Management company',
    COMMUNICATION = 'Landlord communicates well',
    PRIVACY = 'Landlord respects my privacy',
    SUBLETS = 'Landlord allows sublets',
    VALUE = 'This place is a great value for the money',

    // Other
    PETS = 'Great for my Pets',
    KIDS = 'Great for my Kids',
}

export enum ConFlagType {
    /* Residence */
    BATHROOM = 'the Bathroom',
    KITCHEN_APPLIANCES = 'Kitchen Appliances in bad shape',

    // Lights
    NATURAL_LIGHT = 'Not much natural light',
    RELIABLE_LIGHTS = 'Unreliable light fixtures',
    BRIGHT = "You'll need lamps for lights",

    // Maintenance
    MAINTENANCE_FREQ = 'Frequent maintenance issues',
    MAINTENANCE_QUAL = 'Maintenance Issues handled poorly',

    // Utilities
    UTILITIES = 'utilities',

    AMENITIES = 'Amenities not as advertised',
    INTERNET = 'Bad internet',
    CELL_RECEPTION = 'Bad cell reception',
    SMELLS = 'Bad smells',

    NEIGHBORS = 'my Neighbors',
    TRAFFIC_NOISE = 'Noisy Traffic',
    TOWN_NOISE = 'Noisy restaurants, bars',

    LOCATION = 'the Location',

    UNSAFE = 'Did not feel safe',

    LANDLORD = 'my Landlord, Management company',

    // Other
    PETS = 'Bad for my Pets',
    KIDS = 'Bad for my Kids',
}

// a thing of the past?
export enum DbkFlagType {
    LEASE = 'lease issues',
    BURGLARY = 'burglary',
    DEPOSIT = 'security deposit',
    CONSTRUCTION = 'construction harrasment',
    PRIVACY = 'privacy',
    UNRESPONSIVE = 'unresponsive',
}
