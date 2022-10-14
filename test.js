//console.log("hello");
var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
//var fs = require("fs");

var args = process.argv;
console.log(args[2]);

var temp = require("./template/temp.js");
var path = require("path");


var app = http.createServer(function(request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	var title = queryData.id;

	response.writeHead(200);

	if(pathname === "/") {
		var filtertitle = path.parse(title).base;
		fs.readFile(`data/${filtertitle}`, "utf-8", function(err, data) {
				fs.readdir("data", function(error, files){
					var control = `<a href='/create'>create</a>`;
					if(queryData.id == undefined) {
						title = "Welcome";
						data = "hi node";	
					} else {
						control = control+` <a href='/update?id=${title}'>update</a>`;
						control = control+`
						<form action='/delete_process' method='POST'>
							<input type='hidden' name='id' value="${title}"/>
							<input type="submit" value='delete'/>
						</form>
						`
					}
					var list = temp.tlist(files);
					
					var template = temp.tshow(title, data, list, control);
					response.end(template);
				});	
		});
	} else if(pathname === "/create") {
		//console.log("aa");
		fs.readdir("data", function(error, files){
			if(queryData.id == undefined) {
				title = "Web - create";
				data = "hi node";	
			}
			var list = temp.tlist(files);
			var template = temp.tshow(title, `
				<form action="http://localhost:8082/create_process" method="post">
					<p>
						<input type="text" name="title" placeholder='title'>
					</p>
					<p>
						<textarea name="description" placeholder='description'></textarea>
					</p>
					<p>
						<input type="submit" name="">
					</p>
				</form>
				`, list, ` `);
			response.end(template);
		});
	} else if(pathname === "/create_process") {
		var body = "";
		request.on("data", function (data) {
			body = body+data;
		});
		request.on("end", function(){
			var post = qs.parse(body);
			//console.log(post);
			var title = post.title;
			var description = post.description;

			/*file 생성*/
			fs.writeFile(`data/${title}`, description, "utf8", function(err){
				if(err) throw err;
				response.writeHead(302, {Location: `/?id=${title}`});
				response.end("template");
			});
		});
	} else if(pathname === "/update") {
		fs.readdir("data", function(error, files){
			fs.readFile(`data/${queryData.id}`, "utf-8", function(err, data) {
				var title = queryData.id;
				var list = temp.tlist(files);
				var template = temp.tshow(title, `
				<form action="/update_process" method="post">
					<input type='hidden' name='id' value='${title}'/>
					<p>
						<input type="text" name="title" placeholder='title' value='${title}'>
					</p>
					<p>
						<textarea name="description" placeholder='description'>${data}</textarea>
					</p>
					<p>
						<input type="submit" name="">
					</p>
				</form>
				`, list, `<a href='/update?id=${title}'>update</a>`);
		
					response.end(template);
				});	
		});
	} else if(pathname === "/update_process") {
		var body = "";
		request.on("data", function (data) {
			body = body+data;
		});
		request.on("end", function(){
			var post = qs.parse(body);
			var id = post.id;
			var title = post.title;
			var description = post.description;
			console.log(post);

			/*file 생성*/
			fs.rename(`data/${id}`, `data/${title}`, function(err){
				fs.writeFile(`data/${title}`, description, "utf8", function(err){
					if(err) throw err;
					response.writeHead(302, {Location: `/?id=${title}`});
					response.end("template");
				});

			});
		});
	} else if(pathname === "/delete_process") {
		var body = "";
		request.on("data", function (data) {
			body = body+data;
		});
		request.on("end", function(){
			var post = qs.parse(body);
			var id = post.id;
			console.log(post);

			fs.unlink(`data/${id}`, function(err){
				response.writeHead(302, {Location: `/`});
				response.end();
			});
		});
	} else {
		response.writeHead(404);
		response.end("Not Found");
	}


	/*var template = `
	  <!doctype html>
	  <html>``
	  <head>
	    <title>WEB1 - ${title}</title>
	    <meta charset="utf-8">
	  </head>
	  <body>
	    <h1><a href="/">WEB</a></h1>
	    <ol>
	      <li><a href="/?id=HTML">HTML</a></li>
	      <li><a href="/?id=CSS">CSS</a></li>
	      <li><a href="/?id=JavaScript">JavaScript</a></li>
	    </ol>
	    <h2>${title}</h2>
	    <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
	    <img src="coding.jpg" width="100%">
	    </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
	    </p>
	  </body>
	  </html>

	  `;*/
	//response.end(template+"hi hi hi"+(x+y)+__dirname+url);
}).listen(8082);

console.log("hey hey hey hey hey hey hey hey hey hey hey ");