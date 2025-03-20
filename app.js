const express=require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')
//const business = require('./business.js')

let app = express()

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname+"/dist/public"))

app.set('view engine', 'handlebars')
app.set('views', __dirname+"/dist/templates")
app.engine('handlebars', handlebars.engine())

app.get('/', (req, res) =>
{

    const cookie = req.cookies

    if(cookie["cookie"] === undefined)
    {
        res.redirect("/login")
    }

    res.render("index", {layout: undefined})
})

app.get('/login', (req, res) =>
{
    res.render("login", {layout: undefined})
})

app.post('/login', (req, res) =>
{
    console.log("processing.....")
})

app.get('/register', (req, res) =>
{
    res.render("register", {layout: undefined})
})

app.listen(8000, () => { console.log("Running")})