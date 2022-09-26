const { response } = require('express');
const bcrypt = require("bcrypt");
const salt = 10;

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'mubassyir',
  host: 'localhost',
  password : 'password',
  database: 'cdp_binar',
  port: 5432,
})

/* account query
                */

const createAccount = (request, response)=>{
    const {name,email,password} = request.body

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, function(err, hash) {
        pool.query('INSERT INTO account (username, email,password,created_at,updated_at) VALUES ($1,$2,$3,current_timestamp,current_timestamp) RETURNING *',
        [name,email,hash],(error,results)=>{
            response.status(201).json({status : "OK",result: results.rows[0],errors:{error}})
        })
        });
    })
}

const login=(request,response)=>{
    const {email,password} = request.body;
    pool.query('SELECT * FROM account where email = $1',[email],(error,result)=>{
        // console.log(result.rows[0])
        responseReq(200,result.rows[0]);
    })
}

function responseReq(code,payload){
    response.status(code).json({payload})
}

/*
    data queries
                    */
const postProduct = (request, response) => {
  const { name,price,imageurl } = request.body

  pool.query('INSERT INTO product (productname, price,imageurl,created_at,updated_at) VALUES ($1,$2,$3,current_timestamp,current_timestamp) RETURNING *', [name, price,imageurl], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: "OK",result:results.rows[0],errors:{error}});
  })
}
const getAllProduct=(request,response)=>{
    pool.query('SELECT * FROM product ORDER BY id ASC',(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json({status:'OK',result:results.rows,errors:{error}})
    })
}

const getProductById = (request, response) => {
    const id = parseInt(request.params.id);
  
    pool.query('SELECT * FROM product WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json({status:"OK",result:results.rows[0],errors:{error}});
    })
  }

const deleteProduct=(request,response)=>{
    pool.query("DELETE FROM product"),(error,result)=>{
        response.status(200).json(result.rows[0]);
    }
}

const deleteProductByID = (request, response) => {
        const id = parseInt(request.params.id)
      
        pool.query('DELETE FROM product WHERE id = $1', [id], (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).json({status: "OK", errors:`${error}`,result:{message: results}})
        })
    }

    const updateProductById = (request, response) => {
    const id = parseInt(request.params.id)
    const { name,price,imageurl } = request.body
    // response.status(201).json({id:id, nama: name, harga: price, image: imageurl})
  
    pool.query(
      `UPDATE product SET productname = '${name}', price = '${price}', imageurl = '${imageurl}', updated_at= current_timestamp ,WHERE id = '${id}'`,
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).json({status: "OK",results:results.rows[0],errors:{error}})
      }
    )
  }

module.exports = {
    createAccount,
    login,
    postProduct,
    getAllProduct,
    updateProductById,
    getProductById,
    deleteProduct,
    deleteProductByID,
  }