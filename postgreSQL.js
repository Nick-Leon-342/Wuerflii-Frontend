

const { Client } = require('pg')

const table_player = { 
    Name: 'playerTable', 
    Create: function() {return `CREATE TABLE ${this.Name} (  )`} 
}


const table_refreshToken = { 
    Name: 'refreshtoken', 
    Column: 'token', 
    Create: function() {return `CREATE TABLE ${this.Name} ( ${this.Column} TEXT )`} 
}



const client = new Client({

    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'user',
    port: process.env.DATABASE_PORT || 5432,
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'database'

})

client.connect()

function initTables() {

    createTable(table_refreshToken)

}

// function refreshTokenValid(refreshToken) {
    
//     client.query(`SELECT * FROM ${table_refreshToken.Name} WHERE ${table_refreshToken.Column} = '${refreshToken}'`, (err, res) => {
      
//         if (err) return console.error(err)
//         if (res.rows.length > 0) return true

//     })

//     return false

// }

function refreshTokenValid(refreshToken) {
    return new Promise((resolve, reject) => {
        client.query(`SELECT 1 FROM ${table_refreshToken.Name} WHERE ${table_refreshToken.Column} = '${refreshToken}'`, (err, res) => {
            if (err) return reject(err)
            resolve(res.rows.length > 0)
        })
    })
}

function addRefreshToken(refreshToken) {

    client.query(`INSERT INTO ${table_refreshToken.Name} (${table_refreshToken.Column}) VALUES ('${refreshToken}')`, (err, res) => {
        if (err) return console.error(err)
    })

}

function createTable(table) {

    client.query(table.Create(), (err, res) => {
        //client.end()
    })

}




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
