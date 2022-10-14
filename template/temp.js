var temp = {
	tshow : function (title, data, list, control) {
		var template = `
		  <!doctype html>
		  <html>
		  <head>
		    <title>WEB - ${title}</title>
		    <meta charset="utf-8">
		  </head>
		  <body>
		    <h1><a href="/">WEB</a></h1>
		    ${list}
		    ${control}
		    <h2>${title}</h2>
		    <p>${data}</p>
		  </body>
		  </html>
		  `;
		return template;
	},
	tlist : function(files) {
		var list = `<ul>`;
		var i = 0;
		var file = files;
		while(i < file.length) {
			list = list+`<li><a href='/?id=${file[i]}'>${file[i]}</a></li>`;
			i++;
		}
		list = list+"</ul>";
		return list;
	}

}

module.exports = temp;