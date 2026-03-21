import { Database } from "./database.js";


const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const data = database.list();
      return res.end(JSON.stringify(data));
    } 
  },
  {
    method: 'GET',
    path: '/tasks/:id',
    handler: 'getTaskById'
  },
  {
    method: 'POST',
    path: '/tasks',
    handler: ''
  },
  {
    method: 'PUT',
    path: '/tasks',
    handler: ''
  },
  {
    method: 'PATCH',
    path: '/tasks/:id',
    handler: ''
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
    handler: ''
  },

];