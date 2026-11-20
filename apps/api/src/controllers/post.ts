import Post from "../models/Post";
import { getCategory } from "../controllers/category";

const posts: Array<Post> = [];

export const getPost = (id: string) => {
    return posts.find(p => p.id === id);
}

export const getPostIndex = (id: string) => {
    return posts.findIndex(p => p.id === id);
}

const getPosts = (req, res) => {
    return res.status(200).json(posts);
};

const getPostsByCategory = (req, res) => {
    const { category } = req.params;

    const categoryPosts = posts.filter(
        (post) => post.category === category
    );

    return res.status(200).json(categoryPosts);
};

const getPostsById = (req, res) => {
    const { id } = req.params;
    const post = getPost(id);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const category = getCategory(post.category);

    return res.status(200).json({
        ...post,
        category
    });
};

const createPost = (req, res) => {
    const { title, image, description, category } = req.body;

    const fields = {
        title,
        image,
        description,
        category
    };

    for (const [fieldName, value] of Object.entries(fields)) {
        if (!value) {
            return res.status(400).json({
                message: `${fieldName} is required`
            });
        }
    }

    const newPost = {
        id: Date.now().toString(),
        title,
        image,
        description,
        category,
        comments: []
    }

    posts.push(newPost);

    return res.status(201).json(newPost);
};

const createCommentInPost = (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;

    const post = getPost(id);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const fields = {
        author,
        content
    };

    for (const [fieldName, value] of Object.entries(fields)) {
        if (!value) {
            return res.status(400).json({
                message: `${fieldName} is required`
            });
        }
    }

    const newComment = {
        id: Date.now().toString(),
        author,
        content
    };

    post.comments.push(newComment);


    return res.status(201).json(newComment);
};

const updatePost = (req, res) => {
    const { id } = req.params;
    const postIndex = getPostIndex(id);

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const updatedPost = { ...posts[postIndex] };

    const allowedFields = [
        'title',
        'image',
        'description',
        'category',
        'comments',
    ] as const;

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updatedPost[field] = req.body[field];
        }
    });

    posts[postIndex] = updatedPost;

    return res.status(200).json(updatedPost);
};

const deletePost = (req, res) => {
    const { id } = req.params;

    const postIndex = getPostIndex(id);

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const post = getPost(id);

    posts.splice(postIndex, 1);

    return res.status(200).json(post);
};

export default {
    getPosts,
    getPostsByCategory,
    getPostsById,
    createPost,
    createCommentInPost,
    updatePost,
    deletePost
};