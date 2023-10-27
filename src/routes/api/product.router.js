import { Router } from 'express';
//import ProductManager from "../../../ProductManager.js"
import ProductManagerDB from '../../Dao/ProductManagerDB.js';

export const dbM = new ProductManagerDB()

// Importar todos los routers;
export const router = Router();

router.get("/", async (req, res) => {

    try {
        const { limit, page, sort } = req.query
        let filterQuery = { ...req.query }
        if (limit) delete filterQuery.limit
        if (page) delete filterQuery.page
        if (sort) delete filterQuery.sort
        console.log(filterQuery)
        let arrProduct = await dbM.getProducts(limit, page, sort, filterQuery)
        res.status(200).json({
            status: "success",
            ...arrProduct
        })
    } catch (e) {
        res.status(500).json({ status: "error", error: e.message })
    }
})


// Endpoint para traer el producto solicitado by id en el params
router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    if (pid) {
        try {

            let payload = await dbM.getProductById(pid)
            res.status(200).json({ status: "success", payload, })
        } catch (e) {
            res.status(500).json({ status: "error", error: e.message })
        }
    } else res.status(400).json({ status: "error", error: "Debe enviar un id de producto por params" })

})

router.post("/", async (req, res) => {
    const { title, description, code, price,
        status, stock, category, thumbnails } = req.body
    if (title !== undefined && description !== undefined && code !== undefined && price !== undefined && stock !== undefined && category !== undefined) {
        try {
            let obj = {}

            obj.title = title.toString()
            obj.description = description.toString()
            obj.code = code.toString()
            obj.price = parseFloat(price)
            obj.status = Boolean(status ? status : true)
            obj.stock = parseInt(stock)
            obj.category = category.toString()
            obj.thumbnails = thumbnails ? thumbnails : []
            if (thumbnails && Array.isArray(thumbnails)) {
                for (let i = 0; i < thumbnails.length; i++) {
                    obj.thumbnails[i] = thumbnails[i].toString();

                }
            }

            let arrProduct = await dbM.addProduct(obj)
            console.log(arrProduct)
            res.status(200).json({ result: arrProduct })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    } else res.status(400).json({ error: "Faltan campos obligatorios" })

})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params
    let objeChanges = { ...req.body }
    delete objeChanges.id;
    const keysArr = Object.keys(objeChanges)

    if (pid && keysArr.length > 0) {
        try {

            if (objeChanges.title) objeChanges.title = objeChanges.title.toString()
            if (objeChanges.description) objeChanges.description = objeChanges.description.toString()
            if (objeChanges.code) objeChanges.code = objeChanges.code.toString()
            if (objeChanges.price) objeChanges.price = parseFloat(objeChanges.price)
            if (objeChanges.status) objeChanges.status = Boolean(objeChanges.status)
            if (objeChanges.stock) objeChanges.stock = parseInt(objeChanges.stock)
            if (objeChanges.category) objeChanges.category = objeChanges.category.toString()
            if (objeChanges.category) objeChanges.category = objeChanges.category.toString()
            if (objeChanges.thumbnails) {
                if (Array.isArray(objeChanges.thumbnails)) {
                    for (let i = 0; i < objeChanges.thumbnails.length; i++) {
                        objeChanges.thumbnails[i] = objeChanges.thumbnails[i].toString();

                    }
                }
            }


            let arrProduct = await dbM.updateProduct(pid, objeChanges)
            res.status(200).json({ result: arrProduct })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto por params y los campos a modificar por body" })

})

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params

    if (pid) {
        try {
            await dbM.deleteProduct(pid)
            res.status(200).json({ result: "Product Deleted" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: e.message })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto por params" })

})

export const productIdFinderDBM = dbM.getProductById
