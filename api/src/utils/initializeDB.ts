import { Pool } from "pg";

export const initDB = async (db: Pool): Promise<void> => {
  // Define user table
  const userTable = `
  CREATE TABLE IF NOT EXISTS users (
      user_id serial primary key,
      first_name varchar,
      last_name varchar,
      email varchar unique,
      password varchar,
      created_at TIMESTAMP,
      updated_at TIMESTAMP 
  );
  `;
  db.query(userTable, (err, _) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  // Define trigger to update
  const onUpdateUser = `
  CREATE OR REPLACE FUNCTION onUpdate()
  RETURNS TRIGGER
  LANGUAGE plpgsql AS
      $$ BEGIN
      NEW.updated_at := current_timestamp;
      RETURN NEW;
      END; $$;

  DROP TRIGGER IF EXISTS update_user
  ON public.users;

  DROP TRIGGER IF EXISTS update_res
  ON public.residences;
  
  DROP TRIGGER IF EXISTS update_review
  ON public.reviews;

  CREATE TRIGGER update_user
  BEFORE UPDATE ON users
  FOR EACH ROW
    EXECUTE PROCEDURE onUpdate();

  CREATE TRIGGER update_res
    BEFORE UPDATE ON residences
    FOR EACH ROW
      EXECUTE PROCEDURE onUpdate();

  CREATE TRIGGER update_review
    BEFORE UPDATE ON reviews
    FOR EACH ROW
      EXECUTE PROCEDURE onUpdate();
    `;
  db.query(onUpdateUser, (err, _) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  // Residency Table
  const resTable = `
  CREATE TABLE IF NOT EXISTS residences (
      res_id serial primary key,
      google_place_id varchar unique,
      full_address varchar,
      apt_num varchar,
      street_num varchar, 
      route varchar,
      city varchar, 
      state varchar,
      postal_code varchar,
      geog GEOGRAPHY(Point),
      created_at TIMESTAMP,
      updated_at TIMESTAMP 
  );
  `;
  db.query(resTable, (err, _) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  // TenantReview (User-Residency Relationship)
  // Each User can only review any residence once
  const reviewTable = `
   CREATE TABLE IF NOT EXISTS reviews (
    res_id INT NOT NULL,
    user_id INT NOT NULL,
    rating float,
    rent INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT a foreign key(res_id) references residences(res_id),
    CONSTRAINT b foreign key(user_id) references users(user_id)
  ); 
  CREATE UNIQUE INDEX IF NOT EXISTS userResTuple ON reviews (res_id, user_id);
   `;


  db.query(reviewTable, (err, _) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

// Clear all tables
