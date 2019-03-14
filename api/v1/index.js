const express = require('express');
const router = express.Router();
const Blogpost = require('../models/blogpost');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');


router.get('/ping', (req, res) => {
    res.status(200).json({msg: 'pong', date: new Date()});
}); //localhost:3000/ping

// file upload configuration with multer / crypto / path
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: function (req, file, callback) {
		crypto.pseudoRandomBytes(16, function(err, raw){
			if (err) return callback(err);
			callback(null, raw.toString('hex') + path.extname(file.originalname));
		});
	}
});

const upload = multer({storage: storage});

//file upload
router.post('/blog-posts/images', upload.single('blogimage'), (req, res) => {
	if(!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
		return res.status(400).json({ msg: 'only image files please'});
	}
	res.status(201).send({ fileName: req.file.filename, file: req.file });
});

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

router.delete('/blog-posts/:id', (req,res) => {
	//DELETE: localhost:3000/api/v1/blog-posts/a11aeh565
	const id = req.params.id;
	Blogpost.findByIdAndDelete(id, (err, blogPost) => {
		if(err) {
			return res.status(500).json(err);
		}
		res.status(202).json({ msg: `blog post with id ${blogPost._id} deleted`})
	});
	
});

router.delete('/blog-posts', (req,res) => {
	//DELETE: localhost:3000/api/v1/blog-posts?ids=a11aeh565, hahf11hff
	const ids = req.query.ids;
	console.log('query.ids', ids);
	const allIds = ids.split(',').map(id => {
		if(id.match(/^[0-9a-fA-F]{24}$/)){
			return mongoose.Types.ObjectId((id));
		} else {
			console.log('id is not valid', id);
		}
	});
	const condition = { _id: { $in : allIds }}
	Blogpost.deleteMany(condition, (err, result) => {
		if(err) {
			return res.status(500).json(err);
		}
		res.status(202).json(result);
	});
});

module.exports = router;

