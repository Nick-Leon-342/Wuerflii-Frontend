

let list = [];


//____________________Save____________________

const fs = require("fs");

fs.readFile("data.txt", "utf-8", (err, data) => {

    if(err) {console.log(err);} else {
        list = JSON.parse(data);
    }

});

function save() {

    fs.writeFile("data.txt", JSON.stringify(list), (err) => {
        if(err) {console.log(err);}
    });

}





//____________________Socket____________________

const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://192.168.178.41:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {





    //____________________Registration____________________

    socket.on("registration", user => {

        const tmpUser = registration(user.Name, user.Password);
        list.push(tmpUser);
        socket.emit("registration", {Name: tmpUser.Name, Token: tmpUser.Token});
        save();

    })




    
    //____________________Login____________________

    socket.on("login", user => {
        
        const tmpUser = login(user.Name, user.Password);
        socket.emit("login", tmpUser !== "" ? {Name: tmpUser.Name, Token: tmpUser.Token} : "Error");
        save();

    })





    //____________________LoadSessions____________________

    socket.on("loadSessions", user => {

        const tmpUser = getUser(user.Name, user.Token);

        if(tmpUser != null) {
            if(tmpUser.SessionNames_List.length != 0) {
                socket.emit("loadSessions", {SessionNames_List: tmpUser.SessionNames_List, GameAttributes_List: tmpUser.GameAttributes_List, Players_List: tmpUser.Players_List});
            } else {
                socket.emit("loadSessions", null);
            }
        }

    })





    //____________________SaveResults____________________

    socket.on("sessionNameRequest", user => {

        const tmpUser = getUser(user.Name, user.Token);

        socket.emit("sessionNameRequest", generateSessionName(tmpUser.SessionNames_List));
        
    })

    socket.on("saveResults", user => {

        const tmpUser = getUser(user.User.Name, user.User.Token);

        const gameAttributes = user.GameAttributes;
        const players = user.Players;
        const finalScores = user.FinalScores;
        
        const sessionName = gameAttributes.SessionName;


        const tmpG = tmpUser.GameAttributes_List;

        for(let i = 0; tmpG.length > i; i++) {
            if(tmpG[i].SessionName == gameAttributes.SessionName) {
                tmpG[i] = gameAttributes;
                tmpUser.Players_List[i] = players;
                tmpUser.FinalScores_List[i].push(finalScores);
                save();
                return;
            }
        }
    
        tmpUser.GameAttributes_List.push(gameAttributes);
        tmpUser.Players_List.push(players);
        tmpUser.FinalScores_List.push([finalScores]);

        save();

    })





    //____________________FinalScoresRequest____________________

    socket.on("finalScoresRequest", user => {

        const tmpUser = getUser(user.Name, user.Token);
        const sessionName = user.SessionName;

        if(tmpUser != null) {socket.emit("finalScoresRequest", tmpUser.FinalScores_List[tmpUser.SessionNames_List.indexOf(sessionName)]);}

    })


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



function registration(name, password) {
    return {
        Name: name,
        Password: password,
        Token: generateToken(),
        SessionNames_List: [],
        Players_List: [],
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