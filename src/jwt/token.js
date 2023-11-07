import jwt from "jsonwebtoken"

export function generateToken(res, email, password) {
    const token = jwt.sign({ email, password, adminRole: "user" }, "Secret-key", { expiresIn: "24h" })
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 })
    return token
} 