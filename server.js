

const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://192.168.178.41:5500", "http://127.0.0.1:5500", "http://192.168.178.41/test"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    console.log("New User");
    socket.emit("test", "Hello World!");
})
