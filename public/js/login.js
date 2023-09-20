

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("application").style.display = "block";

}, false);





async function next() {

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    if(checkCredentials(name, password)) {
        
        const user = { Name: name, Password: password }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json()
            const url = data.Redirect
            const token = data.Token
            sessionStorage.setItem(sessionStorage_token, token)

            redirect(url, token.AccessToken)

        } catch (error) {
            console.error('Error:', error);
        }
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