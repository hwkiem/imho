import { SQLDataSource } from 'datasource-sql';
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
    getReviewsByUserId,
    getReviewsGeneric,
    updateReviewGeneric,
    writeReview,
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
} from '../Location/location_db_handler';
import { Service } from 'typedi';

@Service()
export class postgresHandler extends SQLDataSource {
    protected knexPostgis: KnexPostgis.KnexPostgis;

    constructor() {
        super(knexConfig);
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

    public updateReviewGeneric = updateReviewGeneric;

    // Helpers
    public reviewColumns = reviewColumns;
}
