

const list = [];


const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://192.168.178.41:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {

    socket.on("registration", user => {

        const tmpUser = registration(user.Name, user.Password);
        list.push(tmpUser);
        socket.emit("registration", {Name: tmpUser.Name, Token: tmpUser.Token});

    })

    
    socket.on("login", user => {
        
        const tmpUser = login(user.Name, user.Password);
        socket.emit("login", tmpUser !== "" ? {Name: tmpUser.Name, Token: tmpUser.Token} : "Error");

    })

})


function registration(name, password) {
    return {
        Name: name,
        Password: password,
        Token: generateToken(),
        SessionNames_List: [],
        GameAttributes_List: [],
        FinalScores_List: []
    };
}

function login(name, password) {

    let user = "";
    for(const tmpUser of list) {

        if(tmpUser.Name == name && tmpUser.Password == password) {
            user = tmpUser;
            user.Token = generateToken();
            break;
        }

    }

    return user;

}

function generateToken() {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getUser(name, token) {

    for(const tmpUser of list) {
        if(tmpUser.Name == name && tmpUser.Token == token) {return tmpUser;}
    }

}









// const {Client} = require("pg");

// const client = new Client({
//     host: "172.23.0.2",
//     user: "kniffel",
//     port: 5432,
//     password: "8%$$9N#ppR7eJ74kyf#V6&3B%PFJ$n67%#@NmaQNurEarcMS#E^6yWJV#@!@tJ#*@m*uGT6wi8kdoE4Ax9^DLBu23ahzkaZ$!Ha5HKzYe8XijMn4&f$M!5BzLexVWh@x",
//     database: "kniffel"
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