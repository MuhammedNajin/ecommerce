const Product = require('../models/product');
const Cart = require('../models/cartModel');
const Address = require('../models/address');




module.exports.loadCart = async (req, res) => {
    try {
        const userId = req.session.user?._id
        const product = await Cart.find({user: userId}, {products: 1}).populate('products.productId');
        //  const products = product[0].products;
         
         const products = product[0]?.products;
        res.render('cart', {products: products});
    } catch (error) {
        console.log(error);
    }
}


module.exports.addToCart = async (req, res) => {
    try {
    
      const {productId, index} = req.body;
      const userId = req.session.user?._id;
      
       
      console.log(productId, index, userId);

      // price of the variant
      const product = await Product.findOne({_id: productId});
      const price = product.variant[index].price;
      

      if(userId) {


        const cart = await Cart.findOne({user: userId});

        if(cart) {

             const exsisting = cart.products.filter((product, i) => product.productId.toString() === productId);
            console.log(exsisting, ' product')
            const exits =  exsisting.find((pro) => pro.product === index);
            const actualIndex =  exsisting.reduce((acc, pro, i) => {
                
                
                  if(pro.product === index) {
                    return acc = i
                  } else {
                    return acc;
                  }

            }, 0);

            
            console.log('inn', actualIndex);
            console.log(exits, 'index');
            console.log('real index', index)
            console.log( typeof index)

             if(exits) {
                console.log('exits')

                const result = await Cart.findOne({user: userId, products:{ $elemMatch: {productId: productId, product: "1"}}});
                console.log(result);
                
                // const he = await Cart.updateOne({user: userId, "products.productId": productId, "products.product": index }, {
                //     $inc: {
                //         "products.$.quantity": 1,
                //     }
                // });

                const he = await Cart.updateOne(
                    { user: userId, "products.productId": productId, "products.product": index },
                    {
                      $inc: {
                        "products.$[elem].quantity": 1,
                      }
                    },
                    {
                      arrayFilters: [
                        { "elem.productId": productId, "elem.product": index }
                      ]
                    }
                  );
                  
                  

                console.log(he);
                const productQuantity = await Cart.findOne({user: userId, "products.productId": productId}, {"products.quantity": 1});
                console.log(productQuantity, 'hellllllllll',)
               
              
                await Cart.updateOne({user: userId, "products.productId": productId, "products.product": index }, {
                    $inc: {
                        "products.$[elem].totalPrice": price *  productQuantity.products[0].quantity,
                    },
                    
                },
                {
                    arrayFilters: [
                      { "elem.productId": productId, "elem.product": index }
                    ]
                  }
                
                );
             } else {
                  console.log('addd')
                await Cart.findOneAndUpdate({user: userId}, {
                    $push: {
                        products: {
                            productId: productId,
                            product: index,
                            price: price,
                            totalPrice: price,

                        }
                    }
                })
             }

        } else {
            console.log('created')
              console.log(price)

              const product = {
                productId: productId,
                product: index,
                price: price,
                totalPrice: price,

              }
              console.log(product)
            
            const cart = new Cart({
                user: userId,
                products: product,

            })

            if(cart) {
                await cart.save();
                
            }
        }

       
        res.json({added: true});
       
 

      }

    
      
    } catch (error) {
        console.log(error);
    }
}


module.exports.proceedToCheckout = async (req, res) => {


    try {
        

        const userid = req.session.user?._id;

        const address = await Address.findOne({user: userid});
       

        const cart = await Cart.findOne({user: userid}).populate('products.productId');
                   console.log(cart)
        res.render('checkOut', {address: address, products: cart.products});

    } catch (error) {
        console.log(error);
    }
}