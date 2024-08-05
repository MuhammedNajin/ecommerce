const Product = require("../models/product");
const Cart = require("../models/cartModel");
const Address = require("../models/address");

module.exports.loadCart = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const product = await Cart.find({ user: userId }, { products: 1 }).populate(
      "products.productId"
    );
    const products = product[0]?.products;
    console.log(products, "cart");
    res.render("cart", { products: products });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { productId, index, size, quantity } = req.body;
    const userId = req.session.user?._id;
    if (!userId) {
      return res.json({ user: true });
    }

    console.log(productId, index, userId, size, quantity);

    // price of the variant
    const product = await Product.findOne({ _id: productId });
    const price = product.variant[index].price;
    const offerPrice = product.variant[index].offerPrice;
    console.log(offerPrice, price);
    const qnt = quantity ? quantity : 1;

    if (userId) {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        const exsisting = cart.products.filter(
          (product, i) => product.productId.toString() === productId
        );
        console.log(exsisting, " product");
        const exits = exsisting.find(
          (pro) => pro.product === index && pro.size === size
        );
        if (!exits) {
          console.log("addd");
          await Cart.findOneAndUpdate(
            { user: userId },
            {
              $push: {
                products: {
                  productId: productId,
                  product: index,
                  price: offerPrice,
                  quantity: qnt,
                  totalPrice: offerPrice * qnt,
                  size: size,
                },
              },
            }
          );
        } else {
          return res.json({ already: true });
        }
      } else {
        console.log("created");
        console.log(price);

        const product = {
          productId: productId,
          product: index,
          price: offerPrice,
          quantity: qnt,
          totalPrice: offerPrice * qnt,
          size: size,
        };
        console.log(product);

        const cart = new Cart({
          user: userId,
          products: product,
        });

        if (cart) {
          await cart.save();
        }
      }

      res.json({ added: true });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const { productId, index, size } = req.body;
    console.log(req.body);

    if (userId) {
      const result = await Cart.updateOne(
        {
          user: userId,
          "products.productId": productId,
          "products.product": index,
          "products.size": size,
        },
        {
          $pull: {
            products: { productId: productId, product: index, size: size },
          },
        },
        {
          arrayFilters: [
            {
              "elem.productId": productId,
              "elem.product": index,
              "elem.size": size,
            },
          ],
        }
      );
      res.json({ removed: true });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.proceedToCheckout = async (req, res) => {
  try {
    const userid = req.session.user?._id;
    const address = await Address.findOne({ user: userid });
    console.log(address);
    const cart = await Cart.findOne({ user: userid }).populate(
      "products.productId"
    );
    console.log(cart);
    res.render("checkOut", { address: address, products: cart.products });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeQuantity = async (req, res) => {
  try {
    const { status, productId, index, size } = req.body;
    console.log(status, productId, index, size);
    const userId = req.session.user?._id;

    const product = await Product.findOne({ _id: productId });
    const variant = product.variant[index];
    const stock = variant.stock;
    const price = variant.offerPrice;
    console.log(price, "price");
    const cart = await Cart.findOne({
      user: userId,
      "products.productId": productId,
    });
    console.log(cart, "cart");
    const cartProduct = cart.products.find(
      (pro) => pro.product === index && pro.size === size
    );
    console.log(cartProduct);
    const quantity = cartProduct.quantity;
    console.log(quantity);

    console.log(variant, "ghhghghghhghghghhghgh");
    if (status === "plus") {
      console.log("plus");
      if (stock > quantity) {
        const he = await Cart.updateOne(
          {
            user: userId,
            "products.productId": productId,
            "products.product": index,
            "products.size": size,
          },
          {
            $inc: {
              "products.$[elem].quantity": 1,
            },
          },
          {
            arrayFilters: [
              {
                "elem.productId": productId,
                "elem.product": index,
                "elem.size": size,
              },
            ],
          }
        );
        const productQuantity = await Cart.findOne(
          { user: userId, "products.productId": productId },
          { "products.quantity": 1 }
        );
        console.log(productQuantity, "update quantity");

        console.log(he);
        await Cart.updateOne(
          {
            user: userId,
            "products.productId": productId,
            "products.product": index,
            "products.size": size,
          },
          {
            $set: {
              "products.$[elem].totalPrice":
                price * productQuantity.products[0].quantity,
            },
          },
          {
            arrayFilters: [
              {
                "elem.productId": productId,
                "elem.product": index,
                "elem.size": size,
              },
            ],
          }
        );
      } else {
        console.log("out of stock");
      }
    } else if (status === "minus") {
      console.log("minus");
      if (quantity > 1) {
        const he = await Cart.updateOne(
          {
            user: userId,
            "products.productId": productId,
            "products.product": index,
            "products.size": size,
          },
          {
            $inc: {
              "products.$[elem].quantity": -1,
            },
          },
          {
            arrayFilters: [
              {
                "elem.productId": productId,
                "elem.product": index,
                "elem.size": size,
              },
            ],
          }
        );

        const productQuantity = await Cart.findOne(
          { user: userId, "products.productId": productId },
          { "products.quantity": 1 }
        );
        console.log(productQuantity, "update quantity");
        cnsole.log(he);
        await Cart.updateOne(
          {
            user: userId,
            "products.productId": productId,
            "products.product": index,
            "products.size": size,
          },
          {
            $set: {
              "products.$[elem].totalPrice":
                price * productQuantity.products[0].quantity,
            },
          },
          {
            arrayFilters: [
              {
                "elem.productId": productId,
                "elem.product": index,
                "elem.size": size,
              },
            ],
          }
        );
      }
    }
    res.json({ changed: true });
  } catch (error) {
    console.log(error);
  }
};
