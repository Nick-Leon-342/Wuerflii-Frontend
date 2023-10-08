

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('application').style.display = 'block'

}, false)





async function next() {

    const name = document.getElementById('name').value
    const password = document.getElementById('password').value

    if(checkCredentials(name, password)) {
        
        const user = { Name: name, Password: password }

        fetch('/registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.redirected) {
                window.location.replace(response.url)
            } else {
                return response.json()
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
    }

}





function switchToLogIn() {
    window.location.replace('/login')
}
