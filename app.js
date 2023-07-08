const express = require('express')
const mysql = require('mysql')
const app = express()
var path = require('path')
const multer = require('multer')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_crud',
})
connection.connect()

app.use(
  '/bootstrap',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist')),
)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

app.get(['/'], (req, res) => {
  const title = 'Users'
  const sql = 'SELECT * FROM members'
  connection.query(sql, (error, results) => {
    if (error) throw error
    res.render('index', { title, data: results })
  })
})

app.get('/add_users', (req, res) => {
  const title = 'Add Users'
  res.render('add_users', { title })
})

app.post('/', multer().none(), (req, res) => {
  const { name, email, phone, password } = req.body
  const sql =
    'INSERT INTO members (name, email, phone, password) VALUES (?, ?, ?, ?)'
  connection.query(sql, [name, email, phone, password], (error, result) => {
    if (error) throw error
    res.redirect('/')
  })
})

app.get('/user_details/:id', (req, res) => {
  const { id } = req.params
  const title = 'Update User'
  const sql = 'SELECT * FROM members WHERE id = ?'
  connection.query(sql, [id], (error, result) => {
    if (error) throw error
    res.render('update_user', { title, data: result })
  })
})

app.post('/update_user/:id', multer().none(), (req, res) => {
  const { name, email, phone, password } = req.body
  const { id } = req.params
  const sql =
    'UPDATE members SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?'
  connection.query(sql, [name, email, phone, password, id], (error, result) => {
    if (error) throw error
    res.redirect('/')
  })
})

app.get('/delete_user/:id', (req, res) => {
  const { id } = req.params
  const sql = 'DELETE FROM members WHERE id = ?'
  connection.query(sql, [id], (error, result) => {
    if (error) throw error
    res.redirect('/')
  })
})
