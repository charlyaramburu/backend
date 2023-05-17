const express = require('express');
const app = express();
const port = 3000;

const ProductManager = require('./productManager'); 

const productManager = new ProductManager('./products.json');

app.use(express.json());

app.get('/products', (req, res) => {
    let products = productManager.getProducts();

    if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }
    }

    res.send(products);
});

app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = productManager.getProductById(id);
    if (!product) {
        res.status(404).send({ error: 'Producto no encontrado' });
    } else {
        res.send(product);
    }
});

app.post('/products', async (req, res) => {
    try {
        productManager.addProduct(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock);
        await productManager.saveToFile();
        res.send({ message: 'Producto agregado con éxito.' });
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al agregar el producto.' });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        productManager.updateProduct(Number(req.params.id), req.body);
        await productManager.saveToFile();
        res.send({ message: 'Producto actualizado con éxito.' });
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al actualizar el producto.' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        productManager.deleteProduct(Number(req.params.id));
        await productManager.saveToFile();
        res.send({ message: 'Producto eliminado con éxito.' });
    } catch (error) {
        res.status(500).send({ error: 'Hubo un error al eliminar el producto.' });
    }
});

app.listen(port, async () => {
    try {
        await productManager.loadFromFile();
        console.log(`ProductManager app listening at http://localhost:${port}`);
    } catch (error) {
        console.error('Error al iniciar el servidor: ', error);
    }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal.' });
});
