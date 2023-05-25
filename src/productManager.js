const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.products = new Map();
        this.counter = 0;
        this.path = path;
    }

    getProducts() {
        return Array.from(this.products.values());
    }

    getProductById(id) {
        return this.products.get(id);
    }

    addProduct(title, description, code, price, status, stock, category, thumbnails) {
        const newProduct = {
            id: this.counter++,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };
        this.products.set(newProduct.id, newProduct);
        return newProduct;
    }

    updateProduct(id, productData) {
        const product = this.products.get(id);
        if (!product) return null;
        const updatedProduct = { ...product, ...productData };
        updatedProduct.id = product.id;
        this.products.set(updatedProduct.id, updatedProduct);
        return updatedProduct;
    }

    deleteProduct(id) {
        return this.products.delete(id);
    }

    async saveToFile() {
        const productsArray = Array.from(this.products.values());
        await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
    }

    async loadFromFile() {
        if (fs.existsSync(this.path)) {
            const productsArray = JSON.parse(await fs.promises.readFile(this.path));
            this.counter = 0;
            this.products.clear();
            for (const productData of productsArray) {
                const product = this.addProduct(productData.title, productData.description, productData.code, productData.price, productData.status, productData.stock, productData.category, productData.thumbnails);
                this.counter = Math.max(this.counter, product.id + 1);
            }
        }
    }
};

module.exports = ProductManager;
