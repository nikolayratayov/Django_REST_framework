let contentContainer = document.getElementById('content-container')
let loginForm = document.getElementById('login-form')
let searchForm = document.getElementById('search-form')
let baseEndpoint = 'http://localhost:8000/api'
if (loginForm){
    loginForm.addEventListener('submit', handleLogin)
}
if (searchForm){
    searchForm.addEventListener('submit', handleSearch)
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
        return response.json()
    })
    .then(authData => {
        handleAuthData(authData, getProductList)
    })
    .catch(err=> {
        console.log('err', err)
    })

}

function handleSearch(event){
    event.preventDefault()

    let formData = new FormData(searchForm)
    let data = Object.fromEntries(formData)
    let searchParams = new URLSearchParams(data)
    let endpoint = `${baseEndpoint}/search/?${searchParams}`
    let headers = {
        'Content-Type': 'application/json',
    }
    let authToken = localStorage.getItem('access')
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }
    let options = {
        'method': 'GET',
        'headers': headers
    }
    fetch(endpoint, options)
    .then(response=>{
        return response.json()
    })
    .then(data => {
        const validData = isTokenNotValid(data)
        if (validData && contentContainer){
            contentContainer.innerHTML = ""
            if (data && data.hits) {
                let htmlStr  = ""
                for (let result of data.hits) {
                    htmlStr += "<li>"+ result.title + "</li>"
                }
                contentContainer.innerHTML = htmlStr
                if (data.hits.length === 0) {
                    contentContainer.innerHTML = "<p>No results found</p>"
                }
            } else {
                contentContainer.innerHTML = "<p>No results found</p>"
            }
        }
    })
    .catch(err=> {
        console.log('err', err)
    })

}

function handleAuthData(authData, callback){
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)
    if (callback) {
        callback()
    }
}

function writeToContainer(data){
    if (contentContainer) {
        contentContainer.innerHTML = '<pre>' + JSON.stringify(data, null, 4) + '</pre>'
    }
}

function getFetchOptions(method, body){
    return{
        'method': method === null ? 'GET': method,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        'body': body ? body : null
    }
}

function isTokenNotValid(jsonData) {
    if (jsonData.code && jsonData.code === 'token_not_valid') {
        alert('Please login again')
        return false
    }
    return true
}

function getProductList(){
    let endpoint = `${baseEndpoint}/products/`
    let options = getFetchOptions()
    fetch(endpoint, options)
    .then(response => response.json())
    .then(data => {
        let validData = isTokenNotValid(data)
        if (validData){
            writeToContainer(data)
        }
    })
}

getProductList()