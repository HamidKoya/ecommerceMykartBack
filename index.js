
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors());




app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})



main().then(()=>console.log('db connected')).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const productSchema = new mongoose.Schema({
    title: String,
    mrp: Number,
    description:String, 
    variants:[
      {
        size:String,
        name:String,
        color:String,
        quantity:Number,
        images:[
          {
            url:String
          }
        ]
      }
    ]
  });

  const Product = mongoose.model('Product', productSchema);
 app.get('/',async(req,res)=>{
  res.send('server running')
 })

  app.post('/product', async (req, res) => {
    const data = req.body
    const newProduct = new Product(data)
    await newProduct.save()
    res.status(201).json(newProduct)
  })

  app.get('/product/:productId', async (req,res)=>{
    const product = await Product.findById(req.params.productId)
    res.status(200).json(product)
  })

  app.patch('/product/:productId', async (req, res) => {
    const data = req.body
    const updatedData = await Product.findByIdAndUpdate(req.params.productId,data,{new:true})
    res.status(200).json(updatedData)

  })

  app.delete('/product/:productId', async(req, res) => {
    await Product.findByIdAndDelete(req.params.productId)
    res.status(204).send('Deleted')
  })

  app.get('/product', async(req, res) => {
   const products = await Product.find({})
   res.status(200).json(products)
  })

}