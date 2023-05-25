const express = require('express');
const app = express();
const port = 8080;

const ProductManager = require('./productManager'); 
const CartManager = require('./CartManager');

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

app.use(express.json());

const productRouter = express.Router();
const cartRouter = express.Router();

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

productRouter.get('/', (req, res) => {
    res.send(productManager.getProducts());
});

productRouter.get('/:pid', (req, res) => {
    const product = productManager.getProductById(Number(req.params.pid));
    if (!product) {
        res.status(404).send({ error: 'Producto no encontrado' });
    } else {
        res.send(product);
    }
});

productRouter.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    // Validación
    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !thumbnails) {
        return res.status(400).send({ error: 'Faltan campos requeridos' });
    }

    try {
        const newProduct = productManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
        await productManager.saveToFile();
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al agregar el producto.' });
    }
});

productRouter.put('/:pid', async (req, res) => {
    const product = productManager.getProductById(Number(req.params.pid));
    if (!product) {
        return res.status(404).send({ error: 'Producto no encontrado' });
    }
    try {
        productManager.updateProduct(Number(req.params.pid), req.body);
        await productManager.saveToFile();
        res.send({ message: 'Producto actualizado con éxito.' });
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al actualizar el producto.' });
    }
});

productRouter.delete('/:pid', async (req, res) => {
    const product = productManager.getProductById(Number(req.params.pid));
    if (!product) {
        return res.status(404).send({ error: 'Producto no encontrado' });
    }
    try {
        productManager.deleteProduct(Number(req.params.pid));
        await productManager.saveToFile();
        res.send({ message: 'Producto eliminado con éxito.' });
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al eliminar el producto.' });
    }
});

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = cartManager.createCart();
        await cartManager.saveToFile();
        res.send(newCart);
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al crear el carrito.' });
    }
});

cartRouter.get('/:cid', (req, res) => {
    const cart = cartManager.getCart(Number(req.params.cid));
    if (!cart) {
        res.status(404).send({ error: 'Carrito no encontrado' });
    } else {
        res.send(cart);
    }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cart = cartManager.getCart(Number(req.params.cid));
    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado' });
    }
    const product = productManager.getProductById(Number(req.params.pid));
    if (!product) {
        return res.status(404).send({ error: 'Producto no encontrado' });
    }
    try {
        cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
        await cartManager.saveToFile();
        res.send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al agregar el producto al carrito.' });
    }
});

app.listen(port, async () => {
    try {
        await productManager.loadFromFile();
        await cartManager.loadFromFile();
        console.log(`App listening at http://localhost:${port}`);
    } catch (error) {
        console.error('Error al iniciar el servidor: ', error);
    }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal.' });
});
