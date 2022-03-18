/* Pros */

/**
 * pros which don't belong to a category
 */
export enum MiscPros {
    NATURAL_LIGHT = 'Plenty of Natural Light',
    RELIABLE_LIGHTS = 'Reliable light fixtures',
    BRIGHT = 'No need for lamps',
    AMENITIES = 'Amazing Amenities',
    POOL = 'the Pool',
    GYM = 'the Gym',
    MAILROOM = 'the Mailroom',
    OUTDOOR = 'the Outdoor Space',
    MAINTENANCE_FREQ = 'Very Few Maintenance Issues',
    MAINTENANCE_QUAL = 'Maintenance Issues handled well',
    PETS = 'Great for my Pets',
    KIDS = 'Great for my Kids',
}

// Pro Subflags
export enum BathroomSubflagsPro {
    BATHROOM = 'the Bathroom',
    WATER_PRESSURE = 'Great water pressure',
    HOT_WATER = 'Shower stays hot for days',
}

export enum KitchenSubflagsPro {
    KITCHEN = 'the Kitchen',
    DISHWASHER = 'Great dishwasher',
    DISPOSAL = 'Great garbage disposal',
    KITCHEN_APPLIANCES = 'Reliable kitchen appliances',
}

export enum LocationSubflagsPro {
    LOCATION = 'the Location',
    FRIENDLY = 'Friendly',
    BLDG_NOISE = 'Quiet building',
    TOWN_NOISE = 'Quiet neighborhood',
    NEAR_FUN = 'Near restaraunts, bars',
    TRAVERSABLE = 'Walkable, bikable',
    NEAR_FOOD = 'Near a grocery store',
    NEAR_TRANSIT = 'Near public transit',
}

export enum LandlordSubflagsPro {
    LANDLORD = 'my Landlord, Management company',
    COMMUNICATION = 'Landlord communicates well',
    PRIVACY = 'Landlord respects my privacy',
    SUBLETS = 'Landlord allows sublets',
    VALUE = 'This place is a great value for the money',
}

/* CONS */

/**
 * cons which map to no categories
 */
export enum MiscCons {
    KITCHEN_APPLIANCES = 'Kitchen Appliances in bad shape',
    NATURAL_LIGHT = 'Not much natural light',
    RELIABLE_LIGHTS = 'Unreliable light fixtures',
    BRIGHT = "You'll need lamps for lights",
    AMENITIES = 'Amenities not as advertised',
}

// Con Subflags

export enum BathroomSubflagsCon {
    BATHROOM = 'the Bathroom',
    WATER_PRESSURE = 'The shower water pressure was weak',
    HOT_WATER = "Hot water doesn't last",
    CLOG = 'Toilet frequently clogged',
    FAN = 'No fan',
    MOLD_MILDEW = 'Mildew, mold issues',
}

export enum MaintenanceSubflagsCon {
    MAINTENANCE = 'Maintenance issues',
    ELECTICAL = 'Electrical issues',
    PLUMBING = 'Plumbing issues',
    APPLIANCES = 'Appliance issues',
    PESTS = 'Pest issues',
    STRUCTURAL = 'Structural issues',
    MAINTENANCE_FREQ = 'Frequent maintenance issues',
    MAINTENANCE_QUAL = 'Maintenance Issues handled poorly',
}

export enum UtilitiesSubflagsCon {
    UTILITIES = 'the Utilities',
    HEATING_QUAL = "Heat isn't good",
    AIRCON_QUAL = "AC isn't good",
    UTIL_COST = 'Expensive utilities',
}

export enum SmellSubflagsCon {
    MOLD_MILDEW = 'Mold, mildew issues',
    TRASH = 'Trash smells',
    SMOKE = 'Smoke smells',
}

export enum LocationSubflagsCon {
    LOCATION = 'the Location',
    NOT_FRIENDLY = 'Not friendly',
    BLDG_NOISE = 'Noisy building',
    NEAR_FUN = 'Not near fun things to do',
    PARKING = 'Difficult parking',
    GROCERY = 'Difficult parking',
    TRANSIT = 'Poor access to public transit',
}

export enum LandlordSubflagsCon {
    LANDLORD = 'my Landlord, Management company',
    UNRESPONSIVE = 'unresponsive',
    REQUESTS = 'Did not address my requests',
    PRIVACY = 'Did not respect my privacy',
    SECURITY_DEPOSIT = 'Security deposit issues',
    LEASE_RENEWAL = 'Premature lease renewal required',
    SUBLETS = 'Landlord does not allow sublets',
    RAISE_RENT = 'Raised my rent a lot',
}

/* Create types combining all positive and negative flags */
export type AllProFlags =
    | MiscPros
    | BathroomSubflagsPro
    | KitchenSubflagsPro
    | LocationSubflagsPro
    | LandlordSubflagsPro;
export type AllConFlags =
    | MiscCons
    | BathroomSubflagsCon
    | MaintenanceSubflagsCon
    | UtilitiesSubflagsCon
    | SmellSubflagsCon
    | LocationSubflagsCon
    | LandlordSubflagsCon;
