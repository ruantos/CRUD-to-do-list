import fs from 'node:fs';

const database_path = 'data/data.json';

export class Database {
  #local_database = [];

  constructor() {
    /** Read file sync and create if it doesnt exist */
    try {
      const data = fs.readFileSync(database_path, 'utf8');
      this.#local_database = JSON.parse(data);
    } catch (err) {
      console.log('Error while reading file: ', err)
      console.log('Creating new database...');
      this.#push();
    }
  }

  #push() {
    /** Push changes or create  */
    fs.writeFileSync(database_path, JSON.stringify(this.#local_database));
  }

  getLocalDatabase() {
    return this.#local_database;
  }

  

}

const db = new Database();
console.log(db.getLocalDatabase());