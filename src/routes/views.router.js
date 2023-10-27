import { Router } from 'express';
import { dbM as dbInstance } from './api/product.router.js';
import { dbM as dbCart } from './api/cart.router.js';

// Importar todos los routers;
export const router = Router();


router.get("/products", async (req, res) => {
    if (!req?.user?.email) return res.redirect("/login")
    try {
        const { limit, page, sort } = req.query
        let on = await dbInstance.getProducts(limit, page, sort)
        let productos = JSON.parse(JSON.stringify(on))
        console.log(req.session)
        res.render("products", {
            hasNextPage: productos.hasNextPage,
            hasPrevPage: productos.hasPrevPage,
            nextLink: productos.nextLink ? `http://localhost:8080/products?page=${productos.page + 1}&limit=${limit ? limit : 10}` : null,
            prevLink: productos.prevLink ? `http://localhost:8080/products?page=${productos.page - 1}&limit=${limit ? limit : 10}` : null,
            productos: productos.payload,
            // name: req.user.first_name,
            // role: req.user.adminRole ? "admin" : "usuario"

        })
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/products/:pid", async (req, res) => {
    if (!req?.user?.email) return res.redirect("/login")

    try {
        const { pid } = req.params
        let on = await dbInstance.getProductById(pid)
        let productos = JSON.parse(JSON.stringify(on))
        console.log(productos)
        res.render("detail", {
            producto: productos
        })
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/carts/:cid", async (req, res) => {
    if (!req?.user?.email) return res.redirect("/login")

    try {
        const { cid } = req.params
        let on = await dbCart.getCartById(cid)
        let productos = JSON.parse(JSON.stringify(on))
        res.render("carts", {
            productos: productos.products
        })
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/login", async (req, res) => {

    if (req?.user?.email) return res.redirect("/products")
    try {

        res.render("login")
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/registro", async (req, res) => {
    if (req?.user?.email) return res.redirect("/products")

    try {

        res.render("registro")
    } catch (e) {
        res.send(500).json({ error: e })
    }
})