require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const http = require('http')
const fs = require('fs')

const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())


let users = []
let refreshToken_list = []










//____________________Save____________________

fs.readFile('data.txt', 'utf-8', (err, data) => {

    if(!err) users = JSON.parse(data);

});

function save() {

    fs.writeFile('data.txt', JSON.stringify(users), (err) => {
        if(err) console.log(err);
    });

}










//____________________________________________________________________________________________________Authentication____________________________________________________________________________________________________

//__________________________________________________Token(-Renewal)__________________________________________________

function refreshAccessToken(refreshToken) {
    if(!refreshToken_list.includes(refreshToken)) return 

    let json
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        if(err) return 
        const at = generateAccessToken(user)
        json = { User: user, AccessToken: at }

    })

    return json

}

function generateToken(user) {

    const tmp = { Name: user.Name, Password: user.Password }
    const accessToken = generateAccessToken(tmp)
    const refreshToken = jwt.sign(tmp, process.env.REFRESH_TOKEN_SECRET)
    refreshToken_list.push(refreshToken)

    return JSON.stringify({ AccessToken: accessToken, RefreshToken: refreshToken })

}

function authenticateToken(req, res, next) {

    const tmp = req.headers.cookie

    if(!tmp) return res.redirect('/login')

    const tokenJSON = JSON.parse(decodeURIComponent(tmp && tmp.split('=')[1]))
    const at = tokenJSON.AccessToken
    const rt = tokenJSON.RefreshToken

    jwt.verify(at, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {

            const json = refreshAccessToken(rt)
            if(json) {
                res.cookie('Token', JSON.stringify({ AccessToken: json.AccessToken, RefreshToken: rt }))
                req.user = json.User
            } else {
                res.clearCookie('Token')
                return res.redirect('/login')
            }

        } else {
            req.user = user
        }
        next()
    })

}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 600 })
}

function noAccessToken(req, res, next) {

    const tmp = req.headers.cookie
    if(!tmp) return next()

    const at = JSON.parse(decodeURIComponent(tmp && tmp.split('=')[1])).AccessToken

    jwt.verify(at, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return next()
        }
        return res.redirect('/creategame')
    })

}





//__________________________________________________Registration__________________________________________________

app.get('/registration', noAccessToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'))
})

app.post('/registration', noAccessToken, async (req, res) => {

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
        
        const token = generateToken(user)
        res.cookie('Token', token)
        return res.redirect('/creategame')
    } catch {
        res.sendStatus(500)
    }

})





//__________________________________________________Login__________________________________________________

app.get('/login', noAccessToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/login', noAccessToken, async (req, res) => {

    const tmp = req.body
    
    for(const user of users) {
        if(user.Name = tmp.Name) {

            try {
                if(await bcrypt.compare(req.body.Password, user.Password)) {
        
                    const token = generateToken(user)
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

    const tmp = req.headers.cookie
    const tokenJSON = JSON.parse(decodeURIComponent(tmp && tmp.split('=')[1]))
    refreshToken_list.splice(refreshToken_list.indexOf(tokenJSON.RefreshToken), 1)
    res.clearCookie('Token')
    res.end()

})





//____________________________________________________________________________________________________End of Authentication____________________________________________________________________________________________________




















app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})





//__________________________________________________CreateGame__________________________________________________

app.get('/creategame', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'creategame.html'));
})





//__________________________________________________SelectSession__________________________________________________

app.get('/selectsession', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'selectsession.html'))
})

app.post('/selectsession', authenticateToken, (req, res) => {
    
    const u = getUser(req.user.Name, req.user.Password)

    if(u) {
        if(u.SessionNames_List.length != 0) {
            const response = { SessionNames_List: u.SessionNames_List, Players_List: u.Players_List, GameAttributes_List: u.GameAttributes_List }
            return res.json(response)
        }
    }
    
    res.sendStatus(500)

})

app.post('/deletesession', authenticateToken, (req, res) => {

    const u = getUser(req.user.Name, req.user.Password)
    const sessionName = req.body.SessionName
    const index = u.SessionNames_List.indexOf(sessionName)

    u.SessionNames_List.splice(index, 1);
    u.GameAttributes_List.splice(index, 1)
    u.Players_List.splice(index, 1)
    u.FinalScores_List.splice(index, 1)

    save()
    res.end()

})





//__________________________________________________SessionPreview__________________________________________________

app.get('/sessionpreview', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sessionpreview.html'))
})

app.post('/sessionpreview', authenticateToken, (req, res) => {

    const u = getUser(req.user.Name, req.user.Password)
    const sessionName = req.body.SessionName

    const json = { FinalScores: u.FinalScores_List[u.SessionNames_List.indexOf(sessionName)] }
    res.json(json)

})





//__________________________________________________SelectSession__________________________________________________

app.get('/enternames', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'enternames.html'))
})





//__________________________________________________Game__________________________________________________

app.get('/game', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'))
})

app.post('/sessionnamerequest', authenticateToken, (req, res) => {
    
    const u = getUser(req.user.Name, req.user.Password)
    if(u) return res.json({ SessionName: generateSessionName(u.SessionNames_List) })

    res.sendStatus(403)

})

function generateSessionName(sessionNames_List) {

    let sessionName;
    
    for(let i = 0; sessionNames_List.length + 1 > i; i++) {
        sessionName = "gameSession_" + i;
        if(!sessionNames_List.includes(sessionName)) {break;}
    }

    sessionNames_List.push(sessionName);
    return sessionName;

}

app.post('/game', authenticateToken, (req, res) => {
    
    const u = getUser(req.user.Name, req.user.Password)
    const json = req.body

    const index = u.SessionNames_List.indexOf(json.GameAttributes.SessionName)
    u.Players_List[index] = json.Players
    u.GameAttributes_List[index] = json.GameAttributes
    if(u.FinalScores_List[index]) {
        u.FinalScores_List[index].push(json.FinalScores)
    } else {
        u.FinalScores_List[index] = [ json.FinalScores ]
    }

    save()
    res.end()

})





//__________________________________________________Endscreen__________________________________________________

app.get('/endscreen', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'endscreen.html'))
})














function getUser(name, password) {

    for(const u of users) {
        if(u.Name == name && u.Password == password) {

            return u

        }
    }

}














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