import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { ImhoUser } from '../entities/ImhoUser';
import { Place } from '../entities/Place';
import { Residence, SINGLE_FAMILY } from '../entities/Residence';
import { PlaceResponse, ResidenceResponse } from '../resolvers/place.resolver';
import { UserResponse } from '../resolvers/user.resolver';
import { CreatePlaceInput } from '../validators/PlaceValidator';
import { CreateResidenceInput } from '../validators/ResidenceValidator';

export const createPlaceIfNotExists = async (
    em: EntityManager<IDatabaseDriver<Connection>>,
    placeInput: CreatePlaceInput
): Promise<PlaceResponse> => {
    try {
        const place = await em.findOneOrFail(Place, {
            google_place_id: placeInput.google_place_id,
        });
        return { result: place };
    } catch {
        const place = new Place(placeInput);
        em.persist(place);
        return { result: place };
    }
};

export const createResidenceIfNotExists = async (
    em: EntityManager<IDatabaseDriver<Connection>>,
    place: Place,
    residenceInput: CreateResidenceInput
): Promise<ResidenceResponse> => {
    try {
        const residence = await em.findOneOrFail(Residence, {
            unit: residenceInput.unit ? residenceInput.unit : SINGLE_FAMILY,
            place: place,
        });
        return { result: residence };
    } catch {
        const residence = new Residence(residenceInput);
        em.persist(residence);
        return { result: residence };
    }
};

export const createPendingUserIfNotExists = async (
    em: EntityManager<IDatabaseDriver<Connection>>,
    userInput: Partial<ImhoUser>
): Promise<UserResponse> => {
    // is there a pending user with this email? create if not
    try {
        const user = await em.findOneOrFail(
            ImhoUser,
            userInput.id
                ? { id: userInput.id }
                : userInput.email
                ? { email: userInput.email }
                : {}
        );
        return { result: user };
    } catch {
        // no user with this email, create inactive account
        if (!userInput.email) {
            return {
                errors: [
                    {
                        field: 'email',
                        error: 'no user with this account, and no email to make pending',
                    },
                ],
            };
        }
        const user = new ImhoUser({ email: userInput.email });
        user.isActivated = false;
        em.persist(user);
        return { result: user };
    }
};
