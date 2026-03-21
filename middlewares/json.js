/**
 * Analisa e formato todo o JSON do body de request.
 * Lê toda a stream, concatena os pedaços e os passa como JSON  
**/

export async function json(req, res) {
  const buffers = [];
  for await( const chunks of req) {
    buffers.push(chunks);
  }

  try {
    req.body = JSON.parse( Buffer.concat(buffers).toString() );
  } catch {
    req.body = null;
  }

  res.setHeader('Content-type', 'application/json')

}