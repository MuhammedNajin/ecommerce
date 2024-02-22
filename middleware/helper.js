const fs = require("node:fs").promises;
const Product = require("../models/product");
const path = require("node:path");

module.exports.deleteFile = async (req, res, next) => {
  try {
    const id = req.body.id;
    const index = req.body.index;

    if (id) {
      return Product.findOne({ _id: id }, { variant: 1 }).then((data) => {
        console.log(data);
        const dbImages = data.variant[index].images;
        console.log(dbImages);
        // for(let i = 0; i < req.files.length; i++){
        //     fs.unlink()
        // }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
