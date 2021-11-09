import KnexPostgis from 'knex-postgis';
import knexConfig from '../database/knexfile';
import {
    changePassword,
    createUser,
    deleteUser,
    getUsersById,
    getUsersGeneric,
} from '../User/user_db_handler';
import {
    createResidence,
    createResidenceIfNotExists,
    getResidencesById,
    getResidencesGeneric,
    getSingleResidenceById,
    residenceExists,
} from '../Residence/residence_db_handler';
import {
    getReviewsByPrimaryKeyTuple,
    getReviewsByResidenceId,
    getReviewsByReviewId,
    getReviewsByUserId,
    getReviewsGeneric,
    updateReviewGeneric,
    writeReview,
    // writeReview,
} from '../Review/review_db_handler';
import { reviewColumns } from '../utils/db_helper';
import {
    createLocation,
    getLocationsById,
    getLocationsNearArea,
    getLocationsGeneric,
    getLocationsBoundingBox,
    locationExists,
    getSingleLocationById,
    createLocationIfNotExists,
    getLocationByPlaceId,
} from '../Location/location_db_handler';
import { Service } from 'typedi';
import { Knex, knex } from 'knex';
import {
    createFlag,
    getFlagsById,
    getFlagsByReviewId,
} from '../Flag/flag_db_handler';

@Service()
export class postgresHandler {
    protected knexPostgis: KnexPostgis.KnexPostgis;
    protected knex: Knex;

    constructor() {
        this.knex = knex(knexConfig);
        this.knexPostgis = KnexPostgis(this.knex);
    }

    // Users
    public getUsersById = getUsersById;

    public getUsersGeneric = getUsersGeneric;

    public createUser = createUser;

    public deleteUser = deleteUser;

    public changePassword = changePassword;

    // Locations

    public getLocationsById = getLocationsById;

    public getSingleLocationById = getSingleLocationById;

    public createLocation = createLocation;

    public createLocationIfNotExists = createLocationIfNotExists;

    public getLocationsNearArea = getLocationsNearArea;

    public getLocationsGeneric = getLocationsGeneric;

    public getLocationsBoundingBox = getLocationsBoundingBox;

    public locationExists = locationExists;

    public getLocationByPlaceId = getLocationByPlaceId;

    // Residences
    public createResidence = createResidence;

    public createResidenceIfNotExists = createResidenceIfNotExists;

    public getResidencesGeneric = getResidencesGeneric;

    public getResidencesById = getResidencesById;

    public getSingleResidenceById = getSingleResidenceById;

    public residenceExists = residenceExists;

    // Reviews
    public writeReview = writeReview;

    public getReviewsGeneric = getReviewsGeneric;

    public getReviewsByUserId = getReviewsByUserId;

    public getReviewsByResidenceId = getReviewsByResidenceId;

    public getReviewsByPrimaryKeyTuple = getReviewsByPrimaryKeyTuple;

    public getReviewsByReviewId = getReviewsByReviewId;

    public updateReviewGeneric = updateReviewGeneric;

    // Flags
    public createFlag = createFlag;

    public getFlagsById = getFlagsById;

    public getFlagsByReviewId = getFlagsByReviewId;

    // Helpers
    public reviewColumns = reviewColumns;
}
