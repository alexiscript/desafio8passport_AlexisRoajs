import path from "path"
import { fileURLToPath } from "url"
import passport from "passport"

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}
export const authorization = (adminRole) => {
    return async (req, res, next) => {
        console.log("Verificando autorización...");
        if (!req.user) {
            console.error("Usuario no autenticado");
            return res.status(401).send({ error: "Unauthorized" });
        }
        if (req.user.adminRole !== adminRole) {
            console.error("No tienes permisos suficientes");
            return res.status(403).send({ error: "No permissions" });
        }
        console.log("Autorización exitosa");
        next();
    };
};

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname 