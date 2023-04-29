class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.counter = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if ([title, description, price, thumbnail, code, stock].includes(undefined)) {
            console.error("Todos los campos son requeridos.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error("Product exists");
            return;
        }

        const product = new Product(this.counter++, title, description, price, thumbnail, code, stock);
        this.products.push(product);
        console.log("Producto agregado.");
    }

    getProducts() {
        console.log(this.products);
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            console.log(product);
        } else {
            console.error("Not found");
        }
    }
}

export default ProductManager;
