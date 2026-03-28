import { Database } from "./database.js";
import { buildRoutePath } from "../utils/build_route_path.js";


const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const data = database.select(req.query);
      return res.end(JSON.stringify(data));
    } 
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const data = database.select(req.params);

      return res.end(JSON.stringify(data));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (req.body) {
        const { title, description } = req.body;

        database.insert({
          id: Math.ceil(Math.random() * 1000),
          title: title,
          description: description,
          is_done: false,
          created_at: new Date().toISOString().split("T")[0],
  
        });
        return res.writeHead(201).end();
      }
      return res.writeHead(400).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      if(!req.body) {
        return res.writeHead(400).end();
      }

      const id = req.params.id;

      const allowedFields = ['title', 'description', 'is_done'];
      const updates = Object.entries(req.body).filter( ([key, value]) => {
        return allowedFields
      });
      for (const [key, value ] of updates ) {
        console.log(key)
        console.log(value)
        database.update(id, key, value);
      }

      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      if(req.params) {
        database.delete(req.params.id);
        return res.writeHead(200).end();
      }

      return res.writeHead(400).end();
    }
  },

];