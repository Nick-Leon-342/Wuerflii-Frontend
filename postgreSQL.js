

const { Client } = require('pg')

const table_player = { 
    Name: 'playerTable', 
    Create: function() {`CREATE ${this.Name} (  )`} 
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
    database: process.env.DATABASE_NAME || 'kniffel'

})

client.connect()

function initTables() {



    createTable(table_refreshToken)

}

function refreshTokenValid(refreshToken) {
    
    client.query(`SELECT 1 FROM ${table_refreshToken.Name} WHERE ${table_refreshToken.Column} = ${refreshToken}`, (err, res) => {
      
        if (err) {
            console.error(err)
            client.end()
        }
        
        if (res.rows.length > 0) return true
        client.end()

    })

    return false

}

function addRefreshToken(refreshToken) {

    client.query(`INSERT INTO ${table_refreshToken.Name} (${table_refreshToken.Column} VALUES ('${refreshToken}'))`, (err, res) => {
    if (err) return console.error(err)
        client.end()
    })

}

function createTable(table) {

    client.query(table.Create(), (err, res) => {
        client.end()
    })

}



initTables()
addRefreshToken('Eins')
addRefreshToken('Zwei')
refreshTokenValid('Zwei')






module.exports = {
    
}
