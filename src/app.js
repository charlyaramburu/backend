const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const exphbs  = require('express-handlebars');
const fs = require('fs');
const ProductManager = require('./productManager');
const CartManager = require('./CartManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

// Load data from file
productManager.loadFromFile().catch(console.error);
cartManager.loadFromFile().catch(console.error);

app.get('/', (req, res) => {
    res.render('index', { products: productManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productManager.getProducts() });
});

io.on('connection', (socket) => {
    socket.on('newProduct', async (productData) => {
        const newProduct = productManager.addProduct(productData.title, productData.description, productData.code, productData.price, productData.status, productData.stock, productData.category, productData.thumbnails);
        await productManager.saveToFile();
        io.emit('productAdded', newProduct);
    });

    socket.on('deleteProduct', async (productId) => {
        productManager.deleteProduct(productId);
        await productManager.saveToFile();
        io.emit('productDeleted', productId);
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
