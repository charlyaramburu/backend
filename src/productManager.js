const fs = require('fs');
const Product = class {
    constructor(id, title, description, price, thumbnail, code, stock) {
        Object.assign(this, { id, title, description, price, thumbnail, code, stock });
    }
};

const ProductManager = class {
    constructor(path) {
        this.products = new Map();
        this.counter = 0;
        this.path = path;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const requiredFields = [title, description, price, thumbnail, code, stock];
        if (requiredFields.includes(undefined)) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.has(code)) {
            console.error("El código ya está en uso.");
            return;
        }

        const newProduct = new Product(this.counter++, title, description, price, thumbnail, code, stock);
        this.products.set(code, newProduct);
    }

    getProducts() {
        return Array.from(this.products.values());
    }

    getProductById(id) {
        const foundProduct = Array.from(this.products.values()).find(product => product.id === id);
        if (!foundProduct) {
            console.error("El id no existe.");
            return;
        }
        return { ...foundProduct };
    }

    updateProduct(id, updatedFields) {
        const product = Array.from(this.products.values()).find(product => product.id === id);

        if (!product) {
            console.error("El id no existe.");
            return;
        }

        for (const [key, value] of Object.entries(updatedFields)) {
            if (key !== 'id' && product.hasOwnProperty(key)) {
                product[key] = value;
            }
        }
    }

    deleteProduct(id) {
        const product = Array.from(this.products.values()).find(product => product.id === id);

        if (!product) {
            console.error("El id no existe.");
            return;
        }

        this.products.delete(product.code);
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
                const product = new Product(this.counter++, productData.title, productData.description, productData.price, productData.thumbnail, productData.code, productData.stock);
                this.products.set(product.code, product);
            }
        }
    }
};

module.exports = ProductManager;
