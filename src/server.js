import http from 'node:http';
import { routes } from './routes.js';
import { json } from '../middlewares/json.js';


const port = 3000;
const hostname = 'localhost';

const server = http.createServer( async (req, res) => {
  const { method, url } = req;
  await json(req, res);

  //tratamento do url e extração dos query parameters
  const parsedUrl = new URL(url, `http://${req.headers.host}`);
  req.query = Object.fromEntries(parsedUrl.searchParams);
  
  const route = routes.find( route => {
    return route.method === method && route.path === parsedUrl.pathname;
  });
  
  if (route) {
    return route.handler(req, res);
  }
  
  return res.writeHead(404).end();

});


server.listen(port, hostname, () =>{
  console.log(`Server running at http://${hostname}:${port}`)
});