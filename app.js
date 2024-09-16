const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Store posts in memory for now
let posts = [];

// Category options
const categories = ["Tech", "Lifestyle", "Education", "Miscellaneous"];

// Routes
app.get('/', (req, res) => {
    const selectedCategory = req.query.category;
    let filteredPosts = posts;

    // Filter posts if a category is selected
    if (selectedCategory && selectedCategory !== 'All') {
        filteredPosts = posts.filter(post => post.category === selectedCategory);
    }

    res.render('index', { posts: filteredPosts, categories: categories, selectedCategory: selectedCategory });
});

app.get('/new-post', (req, res) => {
    res.render('new-post', { categories: categories });
});

app.post('/new-post', (req, res) => {
    const { title, content, author, category } = req.body;
    const newPost = {
        id: Date.now().toString(),
        title,
        content,
        author,
        category,
        createdAt: new Date()
    };
    posts.push(newPost);
    res.redirect('/');
});

app.get('/edit-post/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);
    res.render('edit-post', { post, categories: categories });
});

app.post('/edit-post/:id', (req, res) => {
    const postId = req.params.id;
    const updatedPost = {
        id: postId,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        category: req.body.category,
        createdAt: new Date()
    };
    posts = posts.map(post => (post.id === postId ? updatedPost : post));
    res.redirect('/');
});

app.post('/delete-post/:id', (req, res) => {
    const postId = req.params.id;
    posts = posts.filter(post => post.id !== postId);
    res.redirect('/');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
