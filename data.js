const mongodb = require('mongodb')

let client = undefined 
let db = undefined

async function verifyCode(code)
{
    await connectDatabase()
    let users = db.collection('user')
    let result = await users.findOne({tempCode:code})
    return result
}

async function addTempCode(user, code)
{
    await connectDatabase()
    let users = db.collection('user')
    await users.updateOne({user: user}, {$set: {tempCode: code}})

    console.log("Please proceed to http://127.0.0.1:8000/reset-password/" + code + " to reset the password")
}

async function resetPass(code, pass)
{
    await connectDatabase()
    let users = db.collection('user')
    await users.updateOne({tempCode: code}, {$set: {password: pass}})
    await users.updateOne({tempCode: code}, {$set: {tempCode: null}})
}

async function connectDatabase() {
    if (!client) {
        client = new mongodb.MongoClient('mongodb+srv://60105496:1234@universityclass.xbgyq.mongodb.net')
        db = client.db('nothing')
        await client.connect()
    }
}

async function getUserDetails(username) {
    await connectDatabase()
    let users = db.collection('user')
    let result = await users.findOne({user:username})
    return result
}

async function startSession(sd) {
    await connectDatabase()
    let session = db.collection('session')
    await session.insertOne(sd)
}

async function updateSession(key, data) {
    await connectDatabase()
    let session = db.collection('session')
    await session.replaceOne({key: key}, data)
}

async function getSession(key) {
    await connectDatabase()
    let session = db.collection('session')
    let result = await session.findOne({key: key})
    return result
}

async function terminateSession(key) {
    await connectDatabase()
    let session = db.collection('session')
    await session.deleteOne({key: key})
}

module.exports = {
    resetPass, verifyCode, addTempCode, getUserDetails,
    startSession, updateSession, getSession, terminateSession
}