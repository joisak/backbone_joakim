Post = Backbone.Model.extend({
		urlRoot		: "/post",
		defaults 	: {
			title		: "",
			content		: ""
		}
	});

	PostView = Backbone.View.extend({
		initialize 	: function () {
			this.model.on("sync", this.render, this);
		},

		render	: function (){	
			var createdAt = this.model.get("createdAt");
				this.$el.empty();
				this.$el.append("<h2 class='title'>"+this.model.get("title")+"</h2>");
				this.$el.append("<p class='content'>"+this.model.get("content")+"</p>");
				this.$el.append("<p class='createdAt'>"+createdAt.substr(0,10	)+"</p>");
				this.$el.append("<a href='#/post/'>Back</a>");
				
			return this.el;
		}
	});

	PostEdit = Backbone.View.extend({
		tagName		: "form class='form'",
		initialize 	: function () {
			this.model.on("sync change", this.render, this);
		},

		events  	: {
			"click #submit"		: "editPost"
		},

		editPost 	: function (e){
			e.preventDefault();
			this.model.set({
				title	: $("input[name=title]").val(),
				content	: $("textarea[name=content]").val()
			});
			this.model.save();

		},
		render	: function (){	
				this.$el.empty();
				this.$el.append("<label class='title'>Edit post</label>")
				this.$el.append("<label>Title</label>")
				this.$el.append("<input name='title' value='"+this.model.get("title")+"'>");
				this.$el.append("<label>Content</label>")
				this.$el.append("<textarea name='content'>"+this.model.get("content")+"</textarea>");
				this.$el.append("<button id='submit' data-id='"+this.model.get('id')+"'>Send</button>");
				this.$el.append("<a href='#/post/'>Back</a>");	
			return this.el;
		}
	});

	CreatePost = Backbone.View.extend({
		tagName 	: "form class='form'",
		initialize	: function () {
			this.collection.on("sync change", this.render, this);	
		},

		events		:{
			"click #submit"	: "createPost"
		},

		createPost 	: function(e){
			e.preventDefault();
			this.collection.create({
				title 	: $("input[name=title]").val(),
				content : $("textarea[name=content]").val()
			});
		},

		render		: function(){
				this.$el.empty();
				this.$el.append("<label class='title'>Create a post</label>");
				this.$el.append("<label>Title</label>");
				this.$el.append("<input name='title' value=''>");
				this.$el.append("<label>Content</label>");
				this.$el.append("<textarea name='content'></textarea>");
				this.$el.append("<button id='submit'>Send</button>");
				this.$el.append("<a href='#/post/'>Back</a>");	
			return this.el;
		}
	});

	PostListView	= Backbone.View.extend({

		initialize	: function (){
			this.collection.on("sync remove", this.render, this);
		},

		events  	: {
			"click #delete" 	: "removePost",
			"click #edit"		: "/post/:id/edit"
		},

		removePost 	: function (e){
			e.preventDefault();
			var model = this.collection.get({ id: e.target.dataset.id });
			model.destroy();

		},
		render		: function (){
			this.$el.empty();
			var self = this;
			
			self.$el.append("<h1><a href='#/post/new'>Create a post</a></h1>");
			this.collection.each(function (model){
				var createdAt 	= model.get("createdAt");
				var ingress		= model.get("content");
				self.$el.append("<h2><a href='#/post/"+model.get('id')+"'>"+model.get("title")+"</a></h2>");
				if(ingress.length > 30)
				{
					self.$el.append("<p class='ingress'>"+ingress.substr(0,20)+"....</p>");
				}
				else
				{
					self.$el.append("<p class='ingress'>"+ingress+"</p>");
				}
				self.$el.append("<p class='date'>"+createdAt.substr(0,10	)+"</p>");
				self.$el.append("<p class='lastp'><a href='#' id='delete' data-id='"+model.get('id')+"'>Delete</a><a href='#/post/"+model.get('id')+"/edit'>Edit</a></p>");
				
			});

			return this.el;
		}
	}); 

	PostCollection	= Backbone.Collection.extend({
		model 		: Post,
		url 		: "/post"
	});

	PostRouter	= Backbone.Router.extend({
		routes : {
			"post/"			: "getAllPosts",
			"post/new"		: "createPost", 
			"post/:id"		: "getPost",
			"post/:id/edit"	: "editPost",
		},
		getAllPosts : function(){
			var collection 	= new PostCollection({
			});

			var postListView = new PostListView({
				collection 	: collection
			});

			collection.fetch({
			});

			$("#new").html(postListView.el);
		},
		createPost: function() {
			var postCollection 	= new PostCollection({
			
			});

			var postCreate = new CreatePost({
				collection : postCollection
			});

			postCollection.fetch();

			$("#new").html(postCreate.el);
		},
		getPost: function(id){
			var post = new Post({
				id : id
			});

			var postView = new PostView({
				model 	: post
			});

			post.fetch();

			$("#new").html(postView.el);
		},
		editPost: function(id){
		var post = new Post({
			id : id
		});

		var postEdit = new PostEdit({
			model 	: post
		});

		post.fetch();

		$("#new").html(postEdit.el);
		}

	});

	var postRouter = new PostRouter();

	Backbone.history.start();