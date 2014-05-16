var express = require("express");
var routes 	= require("./routes");
var post 	= require("./routes/post");
var path 	= require("path");
var db		= require("./models");
var app 	= express();
var bodyParser = require("body-parser");


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser());

app.get("/", routes.index);
app.get("/post", post.findAll);
app.get("/post/:id", post.findById);
app.post("/post", post.create);
app.put("/post/:id", post.update);
app.delete("/post/:id", post.destroy);

db.sequelize.sync().complete(function (error){
	if(error)
	{
		throw error;
	}
	else
	{
		var server 	= app.listen(3000, function()
		{ 
		console.log("listening on port %d", server.address().port);
		});

	}
});
