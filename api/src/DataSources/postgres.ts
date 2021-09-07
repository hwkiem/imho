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
    getResidencesNearArea,
    getResidencesObject,
    getResidencesSortBy,
} from '../Residence/residence_db_handler';
import {
    getReviewsByPrimaryKeyTuple,
    getReviewsByResidenceId,
    getReviewsByUserId,
    getReviewsObject,
    updateReviewGeneric,
    writeReview,
} from '../Review/review_db_handler';
import { residenceColumns, reviewColumns } from '../utils/db_helper';

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

    public getResidencesBoundingBox = getResidencesBoundingBox;

    public getResidencesNearArea = getResidencesNearArea;

    public getResidencesSortBy = getResidencesSortBy;

    // Reviews
    public writeReview = writeReview;

    public getReviewsByUserId = getReviewsByUserId;

    public getReviewsByResidenceId = getReviewsByResidenceId;

    public getReviewsByPrimaryKeyTuple = getReviewsByPrimaryKeyTuple;

    public getReviewsObject = getReviewsObject;

    public updateReviewGeneric = updateReviewGeneric;

    // Helpers
    public reviewColumns = reviewColumns;

    public residenceColumns = residenceColumns;
}
