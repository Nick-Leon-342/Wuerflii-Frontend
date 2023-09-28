

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

    Table_Name: 'players', 

    Name: 'name TEXT',
    Password: 'password TEXT',
    UUID: 'uuid TEXT',
    Created: 'created TEXT',

    Create: function() { return `CREATE TABLE ${this.Table_Name} (  )` }

}

const table_sessions = {

    Table_Name: 'sessions',

    UUID: 'uuid TEXT',   //UUID_sessionName
    

    Create: function() { return `CREATE TABLE ${this.Table_Name} (  )` }

}

const table_refreshToken = {

    Table_Name: 'refreshtoken',

    Column: 'token TEXT',

    Create: function() { return `CREATE TABLE ${this.Table_Name} ( ${this.Column} )` } 

}





//____________________InitTables____________________

function initTables() {

    createTable(table_refreshToken)

}

function createTable(table) { client.query(table.Create(), (err, res) => { if(err) console.log(err) }) }





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

    client.query(`INSERT INTO ${table_refreshToken.Table_Name} (${table_refreshToken.Column}) VALUES ('${refreshToken}')`, (err, res) => {
        if (err) return console.error(err)
    })

}

function removeRefreshToken(refreshToken) {

    client.query(`DELETE FROM ${table_refreshToken.Table_Name} WHERE ${table_refreshToken.Column} = '${refreshToken}'`, (err, res) => {
        if(err) console.log(err)
    })

}





//____________________RefreshToken____________________





async function main() {
    initTables()
    await addRefreshToken('Eins')
    await addRefreshToken('Zwei')
    console.log(await refreshTokenValid('Trölf'))
    client.end()
}

main()
    





module.exports = {
    
}
