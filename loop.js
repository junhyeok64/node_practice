//const testFolder = "./test";
const testFolder = "../node";
const fs = require("fs");

fs.readdir(testFolder, (err, files) => {
	files.forEach(file=>{
		console.log(file);
	})
})

fs.readdir(testFolder, function(error, files) {
	console.log(files);
})