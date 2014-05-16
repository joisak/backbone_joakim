var db = require("../models");

exports.findAll = function(req,res){
	db.Post.findAll().success(function(post){
		res.json(post);
	})
}

exports.findById = function (req, res){
	db.Post.find({
		where : {
			id : req.params.id
		}
	}).success(function(post){
		res.json(post);
	})
}

exports.create = function(req, res){
	db.Post.create(req.body).complete(function (error, post){
		res.json(post);
	})
}

exports.update = function(req, res){
	db.Post.find(req.params.id).success(function(post){
		post.updateAttributes(req.body).success(function(post){
			res.json(post);
		})
	})
}

exports.destroy = function(req, res){
	db.Post.find(req.params.id).success(function(post){
		post.destroy().success(function(){
			res.status(200);
			res.end();
		})
	})
}