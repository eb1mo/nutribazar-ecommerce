import Product from "./../models/productModel.js";
import fs from "fs";

const addProduct = async (req, res) =>
{
    try
    {
        let { name, price, description, category, image, stock } = req.body;

        if (req.file)
        {
            image = req.file.path.replace(/\\/g, "/");
        }

        let newProduct = new Product({
            name,
            price,
            description,
            category,
            productImage: image,
            stock,
        })
        await newProduct.save();
        res.send(newProduct);
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
}
const searchProductByTitle = async (req, res) =>
{
    const { name } = req.query;
    if (!name)
    {
        return res.status(400).json({ message: "Name is required" });
    }
    try
    {
        const products = await Product.find({
            name: { $regex: name, $options: "i" },
        });
        if (products.length == 0)
        {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(products);
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
};
const updateProductDetails = async (req, res) =>
{
    try
    {
        const products = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!products)
        {
            return res.status(404).json({ message: "Product not found" });
        }
        if (req.file)
        {
            const product = await Product.findById(req.params.id);
            if (product.productImage)
            {
                fs.unlinkSync(product.productImage);
            }
            products.productImage = req.file.path;
            await products.save();
        }
        res.status(202).json(products);
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
};
const removeProduct = async (req, res) =>
{
    try
    {
        const products = await Product.deleteMany();
        res.status(202).json(products);
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
}
const removeProductById = async (req, res) =>
{
    try
    {
        const products = await Product.findByIdAndDelete(req.params.id);
        if (!products)
        {
            return res.status(404).json({ message: "Product not found" });
        }
        if (req.file)
        {
            const product = await Product.findById(req.params.id);
            if (product.productImage)
            {
                fs.unlinkSync(product.productImage);
            }
            await products.save();
        }
        res.status(202).json(products);
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
};
const fetchProducts = async (req, res) =>
{
    try
    {
        const product = await Product.find().populate("category");
        res.json(product);
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};
const fetchProductById = async (req, res) =>
{
    try
    {
        const product = await Product.findById(req.params.id);
        if (product)
        {
            res.json(product);
        } else
        {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

const getProductsByCategory = async (req, res) =>
{
    const category = req.params.id;
    if (!category)
    {
        return res.status(400).json({ message: "Category is required" });
    }
    try
    {
        const products = await Product.find({ category });
        if (products.length == 0)
        {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(products);
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
};
export
{
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    searchProductByTitle,
    getProductsByCategory,
    removeProductById
}