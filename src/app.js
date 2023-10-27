import express from "express";
import { __dirnaname } from "./utils.js"
import handlebars from "express-handlebars";
import { router as ProductRouter,dbM } from "./routes/api/product.router.js"
import { router as CartRouter} from "./routes/api/cart.router.js"
import { router as viewsRouter } from "./routes/views.router.js"
import { router as sessionRouter } from "./routes/api/sessions.router.js"
// import dotenv from "dotenv";
// dotenv.config();


//import MessageManager from "./Dao/MessagesManager.js";
import "./db/db.config.js"
import "./passport/passportStrategies.js"

import session  from "express-session";
import  FileStore  from "session-file-store";
import passport from "passport";

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirnaname + "/public"))
const fileStore= FileStore(session)
app.use(session({
    store: new fileStore({
        path: __dirnaname+"/sessions"
    }),
    secret:"default",
    
}))

app.use(passport.initialize())
app.use(passport.session())
//Api Routes
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/api/sessions', sessionRouter);




// Views routes
app.use('/', viewsRouter);
app.engine("handlebars", handlebars.engine())
app.set("views", __dirnaname + "/views")
app.set("view engine", "handlebars")

app.get('/', (req, res) => {
    res.redirect('/login')
})

const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log("Andando en puerto " + PORT)
})


httpServer


