import http from 'node:http';
import { routes } from './routes.js';


const port = 3000;
const hostname = 'localhost';


const server = http.createServer((req, res) => {
  const { method, url } = req;

  const route = routes.find( route => {
    return route.method === method && route.path === url;
  });
  
  if (route) {
    console.log(req.url);
    return res.writeHead(200).end();
  }
  
  console.log(req.url);
  return res.writeHead(404).end();

});


server.listen(port, hostname, () =>{
  console.log(`Server running at http://${hostname}:${port}`)
});