import { Router } from 'express';
import UserManager from '../../dao/mongomanagers/userManager.js';
import bcrypt from "bcrypt"
import passport from 'passport';
import { generateToken } from '../../jwt/token.js';

export const dbM = new UserManager()

// Importar todos los routers;
export const router = Router();
let encryptRounds = 1


router.post("/login", async (req, res) => {
        const { email, password } = req.body

        if (email == undefined || password == undefined) return res.status(400).json({ success: false, error: "Faltan datos" })

        let finded = await dbM.findUserByEmail(email.toString().toLowerCase())

        if (!finded.success) return res.status(200).json({ success: false, error: "usuario no encontrado" })
        let user = JSON.parse(JSON.stringify(finded.success))
    /*
        if (password === user.password) {
            console.log(user.first_name)
            req.session.email = user.email
            req.session.password = user.password
            req.session.first_name = user.first_name
            req.session.last_name = user.last_name
            req.session.age = user.age
            req.session.adminRole = user.adminRole

            res.status(200).json({ result: true, adminRole: user.adminRole  })

        }
        else {
            res.status(400).json({ success: false, error: "Contraseña incorrecta" })
        }

    } catch (e) {
        res.status(500).json({ status: "error", error: e.message })
    }*/
    const token = generateToken(res, email, password);
    res.json({token, user: {email:user.email, adminRole: user.adminRole}});
});
/*
router.post("/login", async (req, res) => {
    // Suponiendo que adminRole está disponible en req.user.adminRole después de la autenticación
    const { adminRole } = req.user;

    if (adminRole) {
        res.status(200).json({ result: true, adminRole: adminRole });
    } else {
        res.status(200).json({ result: true, adminRole: null }); // Puedes ajustar el valor predeterminado según sea necesario
    }
});
*/

router.get("/logout", async (req, res) => {
    req.session.destroy((error) =>{
        if(error)
        {
            return res.json({ status: 'Logout Error', body: error})
        }
        res.redirect('../../login')
    })    
})

/*


router.post("/register", async (req, res) => {
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

            let newUser = await dbM.createUser(obj)
            if (!newUser.success) res.status(400).json({ error: "No se pudo crear el usuario" })
            // return res.redirect("../../login")
            res.status(200).json({ result: newUser.success })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    } else return res.status(400).json({ error: "Faltan campos obligatorios" })

}) */

router.post("/register",passport.authenticate("signup"), async (req, res) => {

    if (req.user) res.status(200).json({ result: req.user })

})

router.get('/github',passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/githubcallback',  passport.authenticate('github'),async (req, res) => {
    if (req.user) res.redirect("../../products")

})