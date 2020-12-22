const express = require('express'); 
const fs = require('fs'); 
const path = require('path') 
const formidable = require('formidable');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

app.use(cors())
app.use('/assets/images/src', express.static('img'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/upload.html'));
})

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/auth.html'));
})

app.post('/api/upload', (req, res, next) => { 
	
	const form = new formidable({ multiple: true }); 
	form.parse(req, function(err, fields, files){

		let token = crypto.randomBytes(16).toString('hex');

		var oldPath = files.file.path; 
		var newPath = path.join(__dirname, 'img') 
				+ '/' + token + path.extname(files.file.name);
		var rawData = fs.readFileSync(oldPath) 
	
		fs.writeFile(newPath, rawData, function(err){ 
			if(err) console.log(err) 
			return res.send("Successfully uploaded") 
		}) 
	}) 
});

app.get('/api/get-image-urls', (req, res) => {
	fs.readdir(path.join(__dirname, 'img'), (err, files) => {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}

		const urls = [];	
		for (let i = 0; i < files.length; i++) {
			urls.push(`http://192.168.1.125/assets/images/src/${files[i]}`)
		}
		res.status(200).send(urls);
	})
})

app.get('/auth_config.json', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/auth_config.json'))
})

app.listen(80, () => {
	console.log(`Listening on http://localhost`)
}); 
