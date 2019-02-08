const express = require('express');
const router = express.Router();
const Blogpost = require('../models/blogpost');

router.get('/ping', (req, res) => {
    res.status(200).json({msg: 'pong', date: new Date()});
}); //localhost:3000/ping

router.get('/blog-posts', (req,res) => {
	Blogpost.find()
	.sort({'createdOn': -1 })
	.exec()
	.then(blogPosts => res.status(200).json(blogPosts))
	.catch(err => res.status(500).json({
		message: 'blog post not found :(',
		error: err
	}));
}); //localhost:3000/api/v1/blog-posts

router.get('/blog-posts/:id', (req,res) => {
	const id = req.params.id;
	Blogpost.findById(id)
	.then(blogPost => res.status(200).json(blogPost))
	.catch(err => res.status(500).json({
		message: `blog Post with id ${id} not found`,
		error: err
	}))
}); //localhost:3000/api/v1/blog-posts/id

router.post('/blog-posts', (req, res) => {
	console.log('req.body', req.body);
	const blogPost = new Blogpost(req.body);
	blogPost.save((err, blogPost) => {
		if(err){
			return res.status(500).json(err);
		}
		res.status(201).json(blogPost);
	});
});

module.exports = router;

