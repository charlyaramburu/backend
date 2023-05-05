const Product = class {
    constructor(id, title, description, price, thumbnail, code, stock) {
        Object.assign(this, {id, title, description, price, thumbnail, code, stock});
    }
};

const ProductManager = class {
    constructor() {
        this.products = new Map();
        this.counter = 0;
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
        return foundProduct;
    }
};

const productManager = new ProductManager();
productManager.addProduct('Product1', 'Description1', 10.99, 'product1.jpeg', 'P001', 50);

const allProducts = productManager.getProducts();
console.log(allProducts);

const productId = 0;
const productById = productManager.getProductById(productId);
console.log(productById);

export default { Product, ProductManager };