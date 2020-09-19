'use strict'

const fastify = require('fastify')({
    logger: true
})
const path = require('path')
const AutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie')
const fastifyFormBody = require('fastify-formbody')
const fastifyCSRF = require('fastify-csrf')
const hydra = require('@oryd/hydra-client')
const hydraAdmin = new hydra.AdminApi('http://localhost:4445')
const bcrypt = require('bcryptjs')
const fs = require("fs")

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

const PASSWORD_FILE = process.env.MIDP_PASSWORD_FILE
const REMEMBER_FOR = process.env.MIDP_REMEMBER_FOR || 3600
const PORT = process.env.PORT || 3000

function readPasswordFile() {
    // username -> hash map
    let m = {}
    fs.readFileSync(PASSWORD_FILE, "UTF-8").split("\n").forEach( (l) => {
        let p = l.split(":")
        m[p[0]] = p[1]
    })
    return m
}
const PASSWORDS = readPasswordFile()
function verifyUserPass(username, password) {
    let hash = PASSWORDS[username]
    return bcrypt.compareSync(password, hash)
}

const SCOPE_DESCRIPTION = {openid: 'Information to identify you (user-id)'};
fastify.get('/consent', async function (request, reply) {
    const challenge = request.query.consent_challenge

    const {body: consentRequest} = await hydraAdmin.getConsentRequest(challenge)
    if (consentRequest.skip) {
        const acceptInfo = {
            grantScope: consentRequest.requestedScope,
            grantAccessTokenAudience: consentRequest.requestedAccessTokenAudience,
            session: {}
        }
        const {body: acceptResult} = await hydraAdmin.acceptConsentRequest(challenge, acceptInfo)
        return reply.redirect(301, acceptResult.redirectTo)
    }

    const data = {
      view: "consent",
      viewProps: {
        csrf: request.csrfToken(),
        challenge: challenge,
        list: consentRequest.requestedScope.map((e) => {
            return {label: e, value: e, description: SCOPE_DESCRIPTION[e] || ""}
        })
      }
    }
    const result = template.replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));
    reply.type('text/html');
    return reply.send(result);
})

fastify.post('/consent', async function (request, reply) {
    const {challenge} = request.body
    const {action} = request.body

    if (action != 'accept') {
        const rejectInfo = {
            error: 'access_denied',
            errorDescription: 'The resource owner denied the request'
        }
        const {body: rejectResult} = await hydraAdmin.rejectConsentRequest(challenge, rejectInfo)
        return reply.redirect(301, rejectResult.redirectTo)
    }

    const {scopes, remember} = request.body
    const {body: consentRequest} = await hydraAdmin.getConsentRequest(challenge)
    const acceptInfo = {
        grantScope: scopes,
        session: {},
        grantAccessTokenAudience: consentRequest.requestedAccessTokenAudience,
        remember: Boolean(remember),
        rememberFor: REMEMBER_FOR,
    }
    const {body: acceptResult} = await hydraAdmin.acceptConsentRequest(request.body.challenge, acceptInfo)
    return reply.redirect(301, acceptResult.redirectTo)
})

fastify.get('/login', async function (request, reply) {
    const challenge = request.query.login_challenge
    const {body: loginRequest} = await hydraAdmin.getLoginRequest(challenge)

    if (loginRequest.skip) {
        const acceptInfo = {
            subject: loginRequest.subject
        }
        const {body: acceptResult} = await hydraAdmin.acceptLoginRequest(challenge, acceptInfo)
        return reply.redirect(301, acceptResult.redirectTo)
    }

    const data = {
        view: 'login',
        viewProps: {
            csrf: request.csrfToken(),
            challenge: challenge,
            username: '',
            password: ''
        }
    }
    const result = template.replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));

    reply.type('text/html');
    return reply.send(result);
})

fastify.post('/login', async function (request, reply) {
    const {challenge} = request.body
    const {action} = request.body;
    if (action != 'login') {
        const rejectInfo = {
            error: 'access_denied',
            errorDescription: 'The resource owner denied the request'
        }
        const {body: rejectResult} = await hydraAdmin.rejectLoginRequest(challenge, rejectInfo)
        return reply.redirect(301, rejectResult.redirectTo)
    }

    const {username, password} = request.body
    const verifyOk = verifyUserPass(username, password)
    if (!verifyOk) {
        const data = {
            view: 'login',
            viewProps: {
                csrf: request.csrfToken(),
                challenge: challenge,
                username: '',
                password: ''
            }
        }
        const result = template.replace('SERVER_DATA', 'const SERVER_DATA = ' + JSON.stringify(data));

        reply.type('text/html');
        return reply.send(result);
    }

    const {remember} = request.body
    const acceptInfo = {
        subject: username,
        remeber: Boolean(remember),
        rememberFor: REMEMBER_FOR
    }
    const {body: acceptResult} = await hydraAdmin.acceptLoginRequest(challenge, acceptInfo)
    return reply.redirect(301, acceptResult.redirectTo)
})

// Run the server!
fastify.listen(PORT, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

