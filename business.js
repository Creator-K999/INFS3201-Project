const persistence = require('./data')
const crypto = require('crypto')

async function verifyCode(code)
{
    return await persistence.verifyCode(code)
}

async function forgotPass(email)
{
    const user = email.split("@")[0]
    const userData = await persistence.getUserDetails(user)
    
    if(userData === null)
    {
        return
    }

    await persistence.addTempCode(user, crypto.randomUUID())
}

async function resetPass(code, pass)
{
    let hash = crypto.createHash("sha256").update(pass).digest("hex")
    await persistence.resetPass(code, hash)
}

async function attemptLogin(u, p) {
    let details = await persistence.getUserDetails(u)
    let pass = crypto.createHash("sha256").update(p).digest("hex")
    if (details == undefined || details.password != pass) {
        return undefined
    }
    
    let sessionKey = crypto.randomUUID()
    let sd = {
        key: sessionKey,
        expiry: new Date(Date.now() + 1000*60*5),
        data: {
            username: details.user
        }
    }
    await persistence.startSession(sd)
    return sd
}

async function terminateSession(key) {
    if (!key) {
        return
    }
    await persistence.terminateSession(key)
}

async function getSession(key) {
    return await persistence.getSession(key)
}

module.exports = {
    resetPass, verifyCode, forgotPass, attemptLogin, terminateSession, getSession
}