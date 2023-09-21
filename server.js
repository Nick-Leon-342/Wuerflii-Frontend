require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const http = require('http')
const fs = require("fs")

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://192.168.178.41:3000', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())


let users = []
let refreshToken_list = []










//____________________Save____________________

fs.readFile("data.txt", "utf-8", (err, data) => {

    if(!err) users = JSON.parse(data);

});

function save() {

    fs.writeFile("data.txt", JSON.stringify(users), (err) => {
        if(err) console.log(err);
    });

}










//__________________________________________________SocketIO - Connection__________________________________________________

const { handleConnection } = require('./connectionHandler')
const { error } = require('console')

io.on('connection', socket => handleConnection(socket))










//____________________________________________________________________________________________________Authentication____________________________________________________________________________________________________

//__________________________________________________Token(-Renewal)__________________________________________________

app.post('/token', (req, res) => {

    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshToken_list.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ Name: user.Name, Password: user.Password })
        res.json({ AccessToken: accessToken })

    })

})

function generateToken(user) {

    const tmp = { Name: user.Name, Password: user.Password }
    const accessToken = generateAccessToken(tmp)
    const refreshToken = jwt.sign(tmp, process.env.REFRESH_TOKEN_SECRET)
    refreshToken_list.push(refreshToken)

    return { AccessToken: accessToken, RefreshToken: refreshToken }

}

function authenticateToken(req, res, next) {

    const tmp = req.headers.cookie

    if(tmp == null) return res.redirect('/login')

    const tokenJSON = JSON.parse(decodeURIComponent(tmp && tmp.split('=')[1]))
    const token = tokenJSON.AccessToken

    if(token == null) return res.redirect('/login')

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
}





//__________________________________________________Registration__________________________________________________

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'))
})

app.post('/registration', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10)
        const user = {
            Name: req.body.Name,
            Password: hashedPassword,
            SessionNames_List: [],
            Players_List: [],
            GameAttributes_List: [],
            FinalScores_List: []
        }
        users.push(user)

        save()
        
        const token = JSON.stringify(generateToken(user));
        res.cookie('Token', token)
        return res.redirect('/creategame')
    } catch {
        res.sendStatus(500)
    }

})





//__________________________________________________Login__________________________________________________

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/login', async (req, res) => {

    const tmp = req.body
    
    for(const user of users) {
        if(user.Name = tmp.Name) {

            try {
                if(await bcrypt.compare(req.body.Password, user.Password)) {
        
                    const token = JSON.stringify(generateToken(user))
                    res.cookie('Token', token)
                    return res.redirect('/creategame')
        
                } 
            } catch {}

        }
    }

    return res.status(403).send('Wrong credentials')    

})





//__________________________________________________Logout__________________________________________________

app.delete('/logout', (req, res) => {
    refreshToken_list = refreshToken_list.filter(token => token !== req.body.token)
    res.sendStatus(204)
})





//____________________________________________________________________________________________________End of Authentication____________________________________________________________________________________________________




















app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.get('/test', authenticateToken, (req, res) => {
    res.send(req.user)
})

app.get('/creategame', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'creategame.html'));
})
































const PORT = process.env.PORT || 3000 
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))





















// const {Client} = require('pg');

// const client = new Client({
//     host: '172.23.0.2',
//     user: 'kniffel',
//     port: 5432,
//     password: '8%$$9N#ppR7eJ74kyf#V6&3B%PFJ$n67%#@NmaQNurEarcMS#E^6yWJV#@!@tJ#*@m*uGT6wi8kdoE4Ax9^DLBu23ahzkaZ$!Ha5HKzYe8XijMn4&f$M!5BzLexVWh@x',
//     database: 'kniffel'
// });

// client.connect();

// client.query(`Select *`, (err, res) => {
//     if(!err) {
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
//     client.end;
// })