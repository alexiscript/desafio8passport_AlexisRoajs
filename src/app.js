import express from "express";
import __dirname from "./utils.js";
import { passportCall, authorization } from "./utils.js";
import handlebars from "express-handlebars";
import "./db/db.config.js"
import "./passport/passport.config.js"
import initializePassport from "./passport/passport.config.js";
/*
import { router as ProductRouter,dbM } from "./routes/api/product.routes.js"
import { router as CartRouter} from "./routes/api/carts.routes.js"
import { router as viewsRouter } from "./routes/view.routes.js"
import { router as sessionRouter } from "./routes/api/sessions.routes.js"
*/

import cookieParser from "cookie-parser";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import UserManager from "./Dao/UserManager.js";
import CartManagerDB from "./Dao/CartManagerDB.js";
import { generateToken } from "./jwt/token.js";

const app = express()
const dbM = new UserManager()
const carts = new CartManagerDB()

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        const user = dbM.find((user) => user.email === jwt_payload.email)
        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" })
        }
        return done(null, user)
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser());
initializePassport();

app.use(passport.initialize())

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: app.get('views') });
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email == undefined || password == undefined) {
        return res.status(400).json({ success: false, error: "Faltan datos" });
    }

    let finded = await dbM.findUserByEmail(email.toString().toLowerCase());

    if (!finded.success) {
        return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    let user = JSON.parse(JSON.stringify(finded.success));

    const token = generateToken(res, email, password);
    res.json({ token, user: { email: user.email, adminRole: user.adminRole } });
});

app.post("/api/register", async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        age,
        password,
        adminRole
    } = req.body
    if (first_name !== undefined && last_name !== undefined && email !== undefined && age !== undefined && password !== undefined && adminRole !== undefined) {

        try {
            let existingUser = await dbM.findUserByEmail(email.toString().toLowerCase());
            if (existingUser.success) {
                return res.status(400).json({ error: "El correo electrónico ya está registrado" });
            }
            let obj = {}

            obj.first_name = first_name.toString()
            obj.last_name = last_name.toString()
            obj.email = email.toString().toLowerCase()
            if (isNaN(parseFloat(age))) {
                return res.status(400).json({ error: "La edad debe ser un número válido" });
            }
            obj.age = parseFloat(age);
            obj.adminRole = adminRole.toString().toLowerCase();
            obj.password = password;
            obj.cart = carts.createCart();

            let newUser = await dbM.createUser(obj)
            if (!newUser.success) res.status(400).json({ error: "No se pudo crear el usuario" })
            // return res.redirect("../../login")
            /*
                res.status(200).json({ result: newUser.success })
                */
            const token = generateToken(res, email, password)
            res.send({ token })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    } else return res.status(400).json({ error: "Faltan campos obligatorios" })

});

app.get('/current', passportCall('jwt'), authorization('user'), (req, res) => {
    res.sendFile('home.html', { root: app.get('views') });
});

app.get("/register", async (req, res) => {
    res.sendFile('register.html', { root: app.get('views') });
});

const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log("Andando en puerto " + PORT)
});


httpServer