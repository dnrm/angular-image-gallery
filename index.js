const express = require('express'); 
const fs = require('fs'); 
const path = require('path') 
const multipart = require('connect-multiparty');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

let multipartMiddleware = multipart({uploadDir: './img'});

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

app.post('/api/upload', multipartMiddleware, (req, res, next) => { 
	if (req.files) {
		let filePath = req.files.image.path;
		let fileSplit = filePath.split('\\');
		let fileName = fileSplit[1];
		let extSplit = fileName.split('\.');
		let fileExt = extSplit[1];
		console.log(filePath);

		if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
			return res.status(200).send({
				status: "Uploaded successfully"
			});
		} else {
			fs.unlink(filePath, (err) => {
				return res.status(400).send({
					message: "Extension is not valid"
				});
			})
		}
	} else {
		return res.status(500).send({
			message: 'Image not uploaded'
		})
	}
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
