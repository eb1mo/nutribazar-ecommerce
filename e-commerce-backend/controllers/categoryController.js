import Category from "../models/categoryModel.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Category already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const removeCategory = async (req, res) => {
  try {
    const remove = await Category.findByIdAndDelete(req.params.id);
    res.json(remove);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const all = await Category.find();
    res.json(all);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const readCategories = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createCategory,
  updateCategory,
  removeCategory,
  getCategories,
  readCategories,
};
