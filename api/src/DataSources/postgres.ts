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
    getResidencesBoundingBox,
    getResidencesById,
    getResidencesGeneric,
    getResidencesNearArea,
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

    // Residences
    public createResidence = createResidence;

    public getResidencesGeneric = getResidencesGeneric;

    public getResidencesById = getResidencesById;

    public getResidencesBoundingBox = getResidencesBoundingBox;

    public getResidencesNearArea = getResidencesNearArea;

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
