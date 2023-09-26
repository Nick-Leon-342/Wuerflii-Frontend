

const jwt = require('jsonwebtoken')
const postgreSQL = require('./postgreSQL.js')





//____________________GenerateToken____________________

function generateToken(user) {

    const accessToken = generateAccessToken(user.UUID)
    const refreshToken = jwt.sign(user.UUID, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14d' })
    refreshToken_list.push(refreshToken)

    return JSON.stringify({ AccessToken: accessToken, RefreshToken: refreshToken })

}

function generateAccessToken(user) {
    return jwt.sign(user.UUID, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
}





//____________________RefreshAccessToken____________________

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





//____________________VerifyToken____________________

function authenticateToken(req, res, next) {

    try {

        const tmp = getCookie(req, 'Token')
        if(!tmp) return res.redirect('/login')
    
        const t = JSON.parse(tmp)
        const at = t.AccessToken
        const rt = t.RefreshToken
    
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

    } catch(e) {

        console.log(e)
        res.clearCookie('Token')
        return res.redirect('/login')

    }

}

function noAccessToken(req, res, next) {

    try {

        const tmp = getCookie(req, 'Token')
        if(!tmp) return next()
        const at = JSON.parse(tmp).AccessToken
    
        jwt.verify(at, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                return next()
            }
            return res.redirect('/creategame')
        })

    } catch(e) {

        console.log(e)
        res.clearCookie('Token')
        return

    }

}




module.exports = {

    generateToken,
    generateAccessToken,
    refreshAccessToken,
    authenticateToken,
    noAccessToken

}