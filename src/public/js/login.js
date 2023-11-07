
const divProducts = document.getElementById('products-container')
const form = document.getElementById('formulario')
const email = document.getElementById('email')
const contraseña = document.getElementById('contraseña')


const resetForm = () => {
    email.value = ''
    contraseña.value = ''
}

form.onsubmit = async (e) => {
    e.preventDefault();

    const user = {
        email: email.value,
        password: contraseña.value,
    };

    try {
        const response = await axios.post("http://localhost:8080/login", user);
        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem("token", data.token);
            if (data.token && data.user.adminRole === 'admin') {
                /* window.location.href = '/admin'; */
            } else if (data.token && data.user.adminRole === 'usuario') {
                window.location.href = '/current';
            }
            console.log("Inicio de sesión exitoso");
        } else {
            console.error("Error en el inicio de sesión");
        }
    } catch (error) {
        console.error("Error en el inicio de sesión", error);
    }
};