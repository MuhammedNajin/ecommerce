const e = require("express");
const multer = require("multer");
const path = require("node:path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../public/img/productImage"),
      (err, success) => {
        if (err) {
          console.log(err);
        }
      }
    );
  },

  filename: (req, file, cb) => {
    const filename = Math.random() * 1e17 + "-" + file.originalname; // BigInt

    cb(null, filename, (err, success) => {
      if (err) {
        console.log(err);
      }
    });
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
