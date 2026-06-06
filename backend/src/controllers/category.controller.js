import Category from "../models/Category.model.js";

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllCategories = async (req, res) => {
    const categories = await Category.find();

    res.json({
        success: true,
        categories,
    });
};

export const getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);

    res.json({
        success: true,
        category,
    });
};

export const updateCategory = async (req, res) => {
    try {
        const { name, image, status } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, image, status },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            category: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};