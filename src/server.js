'use strict'
const fastify = require('fastify')({
  logger: true
})
const path = require('path')
const AutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie');
const fastifyFormBody = require('fastify-formbody');
const fastifyCSRF = require('fastify-csrf');

fastify.register(fastifyCookie);
fastify.register(fastifyFormBody);
fastify.register(fastifyCSRF, { cookie: true  });
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '/../public'),
  prefix: '/public/',
  setHeaders: (res, path, stat) => {
    console.log(path)
    if (path.endsWith(".js")) {
      res.setHeader('Content-Type', 'text/javascript')
    }
    if (path.endsWith(".css")) {
      res.setHeader('Content-Type', 'text/css')
    }
  },
})

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width,initial-scale=1'>

	<title>midp</title>

	<link rel='icon' type='image/png' href='/favicon.png'>
	<link rel='stylesheet' href='/public/build/bundle.css'>
	<script>
    SERVER_DATA
    </script>
	<script defer src='/public/build/bundle.js'></script>
</head>

<body>
</body>
</html>
`

fastify.get('/login', async function (request, reply) {
  let data = {"name": "server-data", "csrf": request.csrfToken()}
  const result = template
    .replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));
  reply.type('text/html');
  return reply.send(result);
})

fastify.post('/login', async function (request, reply) {
  let data = {"name": "server-data", "csrf": request.csrfToken()}
  const result = template
    .replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));
  reply.type('text/html');
  return reply.send(result);
})

// Run the server!
fastify.listen(3000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

