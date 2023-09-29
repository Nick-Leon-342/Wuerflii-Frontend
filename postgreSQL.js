

//____________________InitClient____________________

const { Client } = require('pg')

const client = new Client({

    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'user',
    port: process.env.DATABASE_PORT || 5432,
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'database'

})

client.connect()





//____________________TableVariables____________________

const table_players = {

    Table_Name:         'players', 

    Name:               'name',
    Password:           'password',
    UUID:               'uuid',
    Created:            'created',
    List_SessionNames:  'sessionnames',    //Syntax: UUID_sessionName in JSON

    Create: function() { 
        return `CREATE TABLE ${this.Table_Name} ( 
            ${this.Name} TEXT, 
            ${this.Password} TEXT, 
            ${this.UUID} TEXT,
            ${this.Created} TEXT, 
            ${this.List_SessionNames} JSONB
        )` 
    }

}

const table_sessions = {

    Table_Name:         'sessions',

    SessionName:        'sessionname',
    List_Players:       'players',
    List_Attributes:    'attributes',
    List_FinalScores:   'finalscores',

    Create: function() {
        return `CREATE TABLE ${this.Table_Name} (
            ${this.SessionName} TEXT,
            ${this.List_Players} JSONB,
            ${this.List_Attributes} JSONB,
            ${this.List_FinalScores} JSONB
        )`
    }

}

const table_refreshToken = {

    Table_Name: 'refreshtoken',

    Column: 'token',

    Create: function() { return `CREATE TABLE ${this.Table_Name} ( ${this.Column} TEXT )` } 

}





//____________________InitTables____________________

function initTables() {

    createTable(table_players)
    createTable(table_sessions)
    createTable(table_refreshToken)

}

function createTable(table) { client.query(table.Create(), (err, res) => { if(err && !err.toString().includes('already exists')) console.log(err) }) }





//____________________RefreshToken____________________

function refreshTokenValid(refreshToken) {
    return new Promise((resolve, reject) => {
        client.query(`SELECT 1 FROM ${table_refreshToken.Table_Name} WHERE ${table_refreshToken.Column} = '${refreshToken}'`, (err, res) => {
            if (err) return reject(err)
            resolve(res.rows.length > 0)
        })
    })
}

function addRefreshToken(refreshToken) {

    client.query(`INSERT INTO ${table_refreshToken.Table_Name} ( ${table_refreshToken.Column} ) VALUES ('${refreshToken}')`, (err, res) => {
        if (err) return console.error(err)
    })

}

function removeRefreshToken(refreshToken) {

    client.query(`DELETE FROM ${table_refreshToken.Table_Name} WHERE ${table_refreshToken.Column} = '${refreshToken}'`, (err, res) => {
        if(err) console.log(err)
    })

}





//____________________RefreshToken____________________

function addUser(user) {

    Name:               'name',
    Password:           'password',
    UUID:               'uuid',
    Created:            'created',
    List_SessionNames:  'sessionnames',

}














async function main() {
    await initTables()
    await addRefreshToken('Eins')
    await addRefreshToken('Zwei')
    await addRefreshToken('Drei')
    await addRefreshToken('Vier')
    console.log(await refreshTokenValid('Zwei'))
    await removeRefreshToken('Zwei')
    console.log(await refreshTokenValid('Zwei'))
    //client.end()
}
    





module.exports = {
    main
}
