import { Text, Title } from '@mantine/core';
import { Variants } from 'framer-motion';
import { ValuesOfCorrectTypeRule } from 'graphql';
import { useRouter } from 'next/router';
import { FlagsType, Location, LocationCategory } from '../../generated/graphql';
import { MotionContainer } from '../../utils/motion';

const LOCATION_DATA: Location = {
    category: LocationCategory.House,
    google_place_id: 'SOME_GOOGLE_PLACE_ID',
    avg_rating: 73.3,
    imho_score: 86.2,
    landlord_email: 'jryan3211@landlord.com',
    loc_id: 1,
    formatted_address: '12 W 104th Street, New York, NY',
    residences: [
        {
            loc_id: 1,
            res_id: 1,
            avg_rating: 73.3,
            created_at: 'created at date',
            unit: '',
            updated_at: 'created at date',
            reviews: [
                {
                    created_at: 'review 1 written at',
                    updated_at: 'review 1 updated at',
                    rating: 73.3,
                    rev_id: 1,
                    flags: {
                        pros: {
                            natural_light: false,
                            neighborhood: true,
                            amenities: false,
                            appliances: true,
                            good_landlord: false,
                            pet_friendly: true,
                            storage: false,
                        },
                        cons: {
                            bad_landlord: true,
                            pet_unfriendly: false,
                            shower: false,
                            false_advertisement: false,
                            noise: false,
                            mold_or_mildew: true,
                            pests: false,
                            maintenance_issues: false,
                            connectivity: false,
                            safety: false,
                        },
                        dbks: {
                            lease_issues: false,
                            security_deposit: true,
                            burglary: false,
                            construction_harrassment: false,
                            privacy: false,
                            unresponsiveness: false,
                        },
                    },
                    feedback:
                        "I really didn't love this place. There was a stinky stinky thing going on in the bathroom and I had no idea what was creating it.",
                },
                {
                    created_at: 'review 2 written at',
                    updated_at: 'review 2 updated at',
                    rating: 66.1,
                    rev_id: 1,
                    flags: {
                        pros: {
                            natural_light: false,
                            neighborhood: true,
                            amenities: true,
                            appliances: true,
                            good_landlord: false,
                            pet_friendly: false,
                            storage: false,
                        },
                        cons: {
                            bad_landlord: true,
                            pet_unfriendly: false,
                            shower: false,
                            false_advertisement: false,
                            noise: true,
                            mold_or_mildew: true,
                            pests: false,
                            maintenance_issues: false,
                            connectivity: false,
                            safety: false,
                        },
                        dbks: {
                            lease_issues: true,
                            security_deposit: false,
                            burglary: false,
                            construction_harrassment: false,
                            privacy: false,
                            unresponsiveness: false,
                        },
                    },
                    feedback: 'Another review about this place!',
                },
            ],
        },
    ],
};

export default function LocationPage() {
    const router = useRouter();
    const { place_id } = router.query;

    const loc = LOCATION_DATA; // replace with data fetch to api

    // framer motion animation variants
    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            {' '}
            <Title
                sx={{ fontSize: 45, fontWeight: 700, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                {' '}
                <Text
                    inherit
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'lime', deg: 45 }}
                    component="span"
                >
                    {loc.formatted_address}
                </Text>
            </Title>
        </MotionContainer>
    );
}
