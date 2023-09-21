

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("application").style.display = "block";

}, false);





async function next() {

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    if(checkCredentials(name, password)) {
        
        const user = { Name: name, Password: password }

        await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

}





// socket.on("login", data => {

//     if(data != "Error") {
        
//         sessionStorage.setItem(sessionStorage_user, data.Name);
//         sessionStorage.setItem(sessionStorage_token, data.Token);
        
//         window.location.href = "../kniffel.html";

//     } else {

//         console.log("Error - username or password incorrect!");

//     }

// })





function switchToRegistration() {
    window.location.href = "/registration";
}