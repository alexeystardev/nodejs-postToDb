const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const database = require('./database')
const Post = require('./models/post')
const path = require("path");
const publicDirectoryPath = path.join(__dirname, "/public");

app.use(express.static(publicDirectoryPath));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get('/', (req, res) => {
	Post.find({}).then(posts => {
		res.render('index', {
			posts: posts
		})
	})
})

app.get('/create', (req, res) => {
	res.render('create')
})
app.post('/create', (req, res) => {
	const {
		title,
		body
	} = req.body;
	Post.create({
		title: title,
		body: body
	}).then(post => console.log(post.id))

	res.redirect('/')
})

database().then(info => {
	console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
	app.listen(process.env.PORT || `${process.env.PORT}`, () => {
		console.log(`Server running on port: ${process.env.PORT}...`);
	});
}).catch(() => {
	console.error("Unable to connect to database")
	process.exit(1)
})