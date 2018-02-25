const mongoose = require('mongoose');
const Product = mongoose.model('products');
const multer = require('multer');

module.exports = app => {
  app.post('/api/product', (req, res) => {
    Product.findOne({ title: req.body.title})
      .then(product => {
        if (product) {
          console.log('Product already exists')
        } else {
          const storage = multer.diskStorage({
            // TODO: Change path after build setup
            destination: './client/public/img/',
            filename: (req, file, cb) => {
              cb(null, file.originalname);
            }
          });
      
          const upload = multer({
            storage: storage
          }).single('imageFile');
      
          upload(req, res, (err) => {
            if (err) {
              console.log(err, 'project not saved');
            } else {
              filename = req.file.filename;
              const newProduct = new Product({
                title: req.body.title,
                description: req.body.description,
                size: req.body.size,
                price: req.body.price,
                imgPath: filename
              });

              newProduct.save()
                .then(product => {
                  console.log('new product saved');
                })
                .catch(err => {
                  console.log(err);
                });
            }
          })
        }
      });
  });

  app.post('/api/product_delete', (req, res) => {
    let id = req.query.id;

    Product.findByIdAndRemove(id, (err, doc) => {
      if (err) return res.send(err);
      res.json({
        success: 'Product deleted'
      });
    });
  });

  app.get('/api/products', (req, res) => {
    Product.find({}, (err, products) => {
      if (err) return res.send(err);
      res.json(products);
    });
  });

  app.get('/api/product', (req, res) => {
    const id = req.query.id;

    Product.findById(id, (err, product) => {
      if (err) return res.send(err);
      res.json(product);
    });
  });
};
