const fs = require('fs');

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

    addProduct(productId, quantity = 1) {
        const existingProduct = this.products.find(item => item.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            this.products.push({ product: productId, quantity });
        }
    }
}

class CartManager {
    constructor(path) {
        this.carts = new Map();
        this.counter = 0;
        this.path = path;
    }

    createCart() {
        const newCart = new Cart(this.counter++);
        this.carts.set(newCart.id, newCart);
        return newCart;
    }

    getCart(id) {
        return this.carts.get(id);
    }

    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCart(cartId);
        if (!cart) return null;
        cart.addProduct(productId, quantity);
        return cart;
    }

    async saveToFile() {
        const cartsArray = Array.from(this.carts.values());
        await fs.promises.writeFile(this.path, JSON.stringify(cartsArray));
    }

    async loadFromFile() {
        if (fs.existsSync(this.path)) {
            const cartsArray = JSON.parse(await fs.promises.readFile(this.path));
            this.counter = 0;
            this.carts.clear();
            for (const cartData of cartsArray) {
                const cart = new Cart(this.counter++);
                for (const item of cartData.products) {
                    cart.addProduct(item.product, item.quantity);
                }
                this.carts.set(cart.id, cart);
                this.counter = Math.max(this.counter, cart.id + 1);
            }
        }
    }
};

module.exports = CartManager;
