
const divProducts = document.getElementById('products-container')
const form = document.getElementById('formulario')
const first_name = document.getElementById('first_name')
const last_name = document.getElementById('last_name')
const email = document.getElementById('email')
const age = document.getElementById('age')
const password = document.getElementById('password')



const resetForm = () => {
    first_name.value = ''
    last_name.value = ''
    email.value = ''
    age.value = ''
    password.value = ''
    adminRole.value = ''

}


form.onsubmit = async (e) => {
    e.preventDefault()

    const user = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        age: age.value,
        password: password.value,
    }
    console.log(user)
    try {
        await axios.post("http://localhost:8080/api/sessions/registro", user)
        alert("Registrado")
    } catch (error) {
        console.log(error)
        alert(error.response.data.error)
    }
    resetForm()
}