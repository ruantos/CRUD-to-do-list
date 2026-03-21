import { stringify } from 'csv/sync';
import { parse } from 'csv-parse';
import fs from 'node:fs'
import { writeFile } from 'node:fs/promises';

const database_path = './data/tasks.csv'

export class Database {
  #database = [];


  constructor() {
    fs.createReadStream(database_path)
      .pipe( parse({columns: true,}) )
      .on('data', (row) => {
        this.#database.push(row)
      })
  }

  async #persist() {
    const csv = stringify(this.#database, {
      header: true,
      columns: ['id', 'title', 'description']
    });

    await writeFile(database_path, csv, 'utf8');
    
  }

  list() {
    
  }

  select() {

  }

  delete() {

  }

  update() {

  }

  markCompletion() {

  }

  updateInfo() {

  }
}

const database = new Database();
  