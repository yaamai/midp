'use strict'
const fastify = require('fastify')({
  logger: true
})
const path = require('path')
const AutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie');
const fastifyFormBody = require('fastify-formbody');
const fastifyCSRF = require('fastify-csrf');
const hydra = require('@oryd/hydra-client');
const hydraAdmin = new hydra.AdminApi('http://localhost:4445')


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
  let challenge = request.query.login_challenge
  console.log(request.query)
  let loginRequest = await hydraAdmin.getLoginRequest(challenge)
  console.log("Login: ", loginRequest)

  let data = {"name": "server-data", "csrf": request.csrfToken(), "challenge": challenge}
  const result = template
    .replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));
  reply.type('text/html');
  return reply.send(result);
})

fastify.post('/login', async function (request, reply) {

    // check login credential
    // req.body.username, req.body.password
    let acceptResult = await hydraAdmin.acceptLoginRequest(request.body.challenge, {subject: "hogehoge", remember: true, rememberFor: 3600})
    console.log(acceptResult)
    return reply.redirect(301, acceptResult.body.redirectTo)

//  let data = {"name": "server-data", "csrf": request.csrfToken()}
//  console.log(request.body)
//  const result = template
//    .replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));
//  reply.type('text/html');
//  return reply.send(result);
})

// Run the server!
fastify.listen(3000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

