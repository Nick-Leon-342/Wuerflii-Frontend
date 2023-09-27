

require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

const { generateToken, generateAccessToken, refreshAccessToken, authenticateToken, noAccessToken } = require('./jwtToken.js')
//const {  } = require('postgreSQL.js')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())


let users = []










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

function getCookie(req, cookieName) {

    if(req.headers.cookie) {
        let cookie = {}
        req.headers.cookie.split(';').forEach(function(el) {
            let [key,value] = el.split('=')
            cookie[key.trim()] = decodeURIComponent(value)
        })
        return cookie[cookieName]
    }

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
            UUID: uuid.v4(),
            Created: new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'numeric', day: 'numeric' }), // 19.10.2004
            GamesPlayedTotal: 0,
            List_SessionNames: [],
            List_Players: [],
            List_GameAttributes: [],
            List_FinalScores: []
        }
        users.push(user)
        
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

    const tmp = getCookie(req, 'Token')
    if(!tmp) return res.redirect('/login')
    const rt = JSON.parse(tmp).RefreshToken
    refreshToken_list.splice(refreshToken_list.indexOf(rt), 1)
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
        if(u.List_SessionNames.length != 0) {
            const response = { List_SessionNames: u.List_SessionNames, List_Players: u.List_Players, List_GameAttributes: u.List_GameAttributes }
            return res.json(response)
        }
    }
    
    res.sendStatus(500)

})

app.post('/deletesession', authenticateToken, (req, res) => {

    const u = getUser(req.user.Name, req.user.Password)
    const sessionName = req.body.SessionName
    const index = u.List_SessionNames.indexOf(sessionName)

    u.List_SessionNames.splice(index, 1);
    u.List_GameAttributes.splice(index, 1)
    u.List_Players.splice(index, 1)
    u.List_FinalScores.splice(index, 1)

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

    const json = { FinalScores: u.List_FinalScores[u.List_SessionNames.indexOf(sessionName)] }
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
    if(u) return res.json({ SessionName: generateSessionName(u.List_SessionNames) })

    res.sendStatus(403)

})

function generateSessionName(List_SessionNames) {

    let sessionName;
    
    for(let i = 0; List_SessionNames.length + 1 > i; i++) {
        sessionName = "gameSession_" + i;
        if(!List_SessionNames.includes(sessionName)) {break;}
    }

    List_SessionNames.push(sessionName);
    return sessionName;

}

app.post('/game', authenticateToken, (req, res) => {
    
    const u = getUser(req.user.Name, req.user.Password)
    const json = req.body

    const index = u.List_SessionNames.indexOf(json.GameAttributes.SessionName)
    u.List_Players[index] = json.Players
    u.List_GameAttributes[index] = json.GameAttributes
    if(u.List_FinalScores[index]) {
        u.List_FinalScores[index].push(json.FinalScores)
    } else {
        u.List_FinalScores[index] = [ json.FinalScores ]
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










const PORT = process.env.PORT || 10000 
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

