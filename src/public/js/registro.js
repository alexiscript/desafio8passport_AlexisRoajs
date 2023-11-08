const divProducts = document.getElementById('products-container')
const form = document.getElementById('formulario')
const first_name = document.getElementById('first_name')
const last_name = document.getElementById('last_name')
const email = document.getElementById('email')
const age = document.getElementById('age')
const password = document.getElementById('password')
const adminRole = document.getElementById('adminRole')



const resetForm = () => {
    first_name.value = ''
    last_name.value = ''
    email.value = ''
    age.value = ''
    password.value = ''
    adminRole.value = ''

}



form.onsubmit = async (e) => {
    e.preventDefault();

    const user = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        age: age.value,
        password: password.value,
        adminRole: adminRole.value
    };

    try {
        const response = await axios.post("http://localhost:8080/api/register", user);
        if (response.status === 200) {
            if (response.data) {
                
                const confirmation = confirm('¡Registro exitoso! ¿Desea ir a la página de inicio de sesión?');
                if (confirmation) {
                    window.location.href = 'http://localhost:8080/'; // Redirige a la página de inicio de sesión
                } else {
                    resetForm();
                }
            }
        }
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
        }
    }
};
