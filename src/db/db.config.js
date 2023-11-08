import mongoose from "mongoose";



mongoose.connect(`mongodb+srv://Desafio:XHzxaGgsH9DmOh7N@desafio.tsokbhn.mongodb.net/EcomerceApi?retryWrites=true&w=majority`)
    .then(() => console.log("conectado a mongoDB Atlas"))
    .catch(error => {
        console.error("Error al conectarse a la base de datos, error" + error)
    })