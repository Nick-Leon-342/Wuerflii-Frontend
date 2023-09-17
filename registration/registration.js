

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("application").style.display = "block";

}, false);

const socket = io("http://192.168.178.41:3000");





function next() {

    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    if(name != "" && password != "") {
        socket.emit("registration", {Name: name, Password: password});
    }

}





socket.on("registration", data => {

    sessionStorage.setItem(sessionStorage_user, data.Name);
    sessionStorage.setItem(sessionStorage_token, data.Token);

    window.location.href = "../kniffel.html";

})





function switchToLogIn() {
    window.location.href = "../login/login.html";
}
