let loginForm = document.getElementById('login-form')
let baseEndpoint = 'http://localhost:8000/api'
if (loginForm){
    loginForm.addEventListener('submit', handleLogin)
}

function handleLogin(event){
    event.preventDefault()
    let loginEndpoint = `${baseEndpoint}/token/`
    let loginFormData = new FormData(loginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(loginObjectData)
    }
    fetch(loginEndpoint, options)
    .then(response=>{
        console.log(response)
        return response.json()
    })
    .then(x => {
        console.log(x)
    })
    .catch(err=> {
        console.log('err', err)
    })

}