

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










const PORT = process.env.PORT || 10000 
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

