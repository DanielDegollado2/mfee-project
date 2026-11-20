import { Category } from "../models/category";

const categories: Array<Category> = [];

export const getCategory = (id: string) => {
    return categories.find(c => c.id === id);
}

export const getCategoryIndex = (id: string) => {
    return categories.findIndex(c => c.id === id);
}

const getCategories = (req, res) => {
    return res.status(200).json(categories);
};

const getCategoryById = (req, res) => {
    const { id } = req.params;
    const category = getCategory(id);

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
};

const createCategory = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const newCategory = {
        id: Date.now().toString(),
        name
    }

    categories.push(newCategory);

    console.log(req.body);
    return res.status(201).json(newCategory);
};

const updateCategory = (req, res) => {
    const { id } = req.params;

    const categoryIndex = getCategoryIndex(id)

    if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = { ...categories[categoryIndex] };
    const { name } = req.body;

    if (name) {
        updatedCategory.name = name;
    }

    categories[categoryIndex] = updatedCategory;

    return res.status(200).json(updatedCategory);
};

const deleteCategory = (req, res) => {
    const { id } = req.params;

    const categoryIndex = getCategoryIndex(id)

    if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Category not found' });
    }

    categories.splice(categoryIndex, 1);

    return res.status(204).send();
};

export default {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}