import { SQLDataSource } from 'datasource-sql';
import KnexPostgis from 'knex-postgis';
import knexConfig from '../database/knexfile';
import {
    changePassword,
    createUser,
    deleteUser,
    getUsersById,
    getUsersLimit,
    getUsersObject,
} from '../User/user_db_handler';
import {
    createResidence,
    getResidencesBoundingBox,
    getResidencesById,
    getResidencesLimit,
    getResidencesNearArea,
    getResidencesObject,
} from '../Residence/residence_db_handler';
import {
    getReviewsByResidenceId,
    getReviewsByUserId,
    getReviewsLimit,
    getReviewsObject,
    writeReview,
} from '../Review/review_db_handler';

export class postgresHandler extends SQLDataSource {
    protected knexPostgis: KnexPostgis.KnexPostgis;

    constructor() {
        super(knexConfig);
        this.knexPostgis = KnexPostgis(this.knex);
    }

    // Users
    public getUsersById = getUsersById;

    public getUsersLimit = getUsersLimit;

    public getUsersObject = getUsersObject;

    public createUser = createUser;

    public deleteUser = deleteUser;

    public changePassword = changePassword;

    // Residences
    public createResidence = createResidence;

    public getResidencesById = getResidencesById;

    public getResidencesObject = getResidencesObject;

    public getResidencesLimit = getResidencesLimit;

    public getResidencesBoundingBox = getResidencesBoundingBox;

    public getResidencesNearArea = getResidencesNearArea;

    // Reviews
    public writeReview = writeReview;

    public getReviewsByUserId = getReviewsByUserId;

    public getReviewsByResidenceId = getReviewsByResidenceId;

    public getReviewsLimit = getReviewsLimit;

    public getReviewsObject = getReviewsObject;
}
