

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('application').style.display = 'block';

}, false);





async function next() {

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    if(checkCredentials(name, password)) {
        
        const user = { Name: name, Password: password }

        try {
            const response = await fetch('/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json()
            sessionStorage.setItem(sessionStorage_token, data.Token)

            GET(data.Redirect, data.Token.AccessToken)

        } catch (error) {
            console.error('Error:', error);
        }
    }

}





function switchToLogIn() {
    window.location.href = '/login';
}
