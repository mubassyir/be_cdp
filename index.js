const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

/*
  account 
            */
app.post('/account',db.createAccount);
app.get('/login', db.login);

/* 
  product 
            */
app.post('/product',db.postProduct);
app.delete('/product',db.deleteProduct);
app.get('/product',db.getAllProduct);
app.get('/product/:id',db.getProductById);
app.put('/product/:id',db.updateProductById)
app.delete('/product/:id',db.deleteProductByID);




app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})