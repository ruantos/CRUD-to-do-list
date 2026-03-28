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
      console.log(req.params)
      const data = database.select(req.params);

      return res.end(JSON.stringify(data));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: ''
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks'),
    handler: ''
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: ''
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: ''
  },

];