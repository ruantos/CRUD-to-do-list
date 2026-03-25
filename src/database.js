import fs from 'node:fs';

const database_path = 'data/data.json';

export class Database {
  #local_database = [];

  constructor() {
    try {
      const data = fs.readFileSync(database_path, 'utf8');
      this.#local_database = JSON.parse(data);
    } catch (err) {
      console.log('Error while reading file: ', err);
      console.log('Creating new database...');
      this.#push();
    }
  }

  #push() {
    fs.writeFileSync(database_path, JSON.stringify(this.#local_database));
  }

  insert(task) {
    this.#local_database.push(task);
    this.#push();
  }

  delete(id) {
    const idx = this.#local_database.findIndex((item) => {
      return item.id === id;
    });

    if (idx >= 0) {
      this.#local_database.splice(idx, 1);
      this.#push();
    } else {
      console.log("Item not found")
    }

  }

  select(query = {}) {
    let result = [...this.#local_database];

    for (const [key, value] of Object.entries(query)) {
      result = result.filter((item) => {
        const actual = item[key];


        if (typeof value === 'string' && typeof actual === 'string') {
          return actual.toLowerCase().includes(value.toLowerCase());
        }

        return actual === value;
      });
    }

    return result;
  }

  update(id, key, value) {
    const idx = this.#local_database.findIndex((item) => {
      return item.id === id
    });

    if (idx >= 0) {
      this.#local_database[idx][key] = value;
      this.#push();
    } else {
      console.log("Item not found ")
    }
  }
}
