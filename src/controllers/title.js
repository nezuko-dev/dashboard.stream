const Title = require("../models/title");
const Franchise = require("../models/franchise");
// file
const crypto = require("crypto");
const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");

const uploadPath = path.join(__dirname, `${process.env.UPLOAD_PATH}/raw/`);
const imagePath = path.join(
  __dirname,
  `${process.env.UPLOAD_PATH}/images/titles/`
);
fs.ensureDir(imagePath);
fs.ensureDir(uploadPath);

const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
exports.index = async (req, res) => {
  const { franchise } = req.query;
  if (franchise) {
    return res.json({
      status: true,
      data: await Title.find({ franchise }),
      franchise: await Franchise.findById(franchise).select("name"),
    });
  } else res.json({ status: true, data: await Title.find({}) });
};
exports.add = (req, res) => {
  const {
    name,
    label,
    status,
    total_episode,
    plot,
    cover,
    poster,
    price,
    episodes,
    franchise,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Title.create({
      name,
      label,
      status,
      total_episode,
      plot,
      price,
      episodes,
      franchise,
      "images.cover": {
        md: "/content/images/titles/md-" + cover,
        sm: "/content/images/titles/sm-" + cover,
        original: "/content/images/titles/" + cover,
      },
      "images.poster": {
        md: "/content/images/titles/md-" + poster,
        sm: "/content/images/titles/sm-" + poster,
        original: "/content/images/titles/" + poster,
      },
    })
      .then(() => res.json({ status: true }))
      .catch((err) => {
        console.log(err);
        return res.json({ status: true });
      });
  }
};
exports.image = (req, res) => {
  const { type } = req.params;
  req.pipe(req.busboy); // Pipe it trough busboy
  req.busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if ("image/jpeg" !== mimetype && "image/png" !== mimetype) {
      file.resume();
      return res.status(400).json({ status: false, message: "Алдаатай файл" });
    } else {
      // Create a write stream of the new file
      var name = `${crypto.randomBytes(12).toString("hex")}.${filename
        .split(".")
        [filename.split(".").length - 1].toLowerCase()}`;
      const fstream = fs.createWriteStream(path.join(uploadPath, name));
      // Pipe it trough
      file.pipe(fstream);
      // On finish of the upload
      const image = path.join(uploadPath, name);
      fstream.on("close", async () => {
        if (type == "cover") {
          // original 1920 × 1080 , md 712 × 400 , sm 341 × 192 > tabled and pc
          await sharp(image)
            .resize(1920, 1080)
            .toFile(path.join(imagePath, name));
          await sharp(image)
            .resize(712, 400)
            .toFile(path.join(imagePath, `md-${name}`));
          await sharp(image)
            .resize(341, 192)
            .toFile(path.join(imagePath, `sm-${name}`));
        } else if (type == "poster") {
          // original 960 × 1440 , md 480 × 720 , sm 160 × 240 display > on mobile
          await sharp(image)
            .resize(960, 1440)
            .toFile(path.join(imagePath, name));
          await sharp(image)
            .resize(480, 720)
            .toFile(path.join(imagePath, `md-${name}`));
          await sharp(image)
            .resize(160, 240)
            .toFile(path.join(imagePath, `sm-${name}`));
        } else res.json({ status: false });
        // remove raw images
        fs.removeSync(image);
        return res.json({ status: true, filename: name });
      });
    }
  });
};
exports.update = (req, res) => {
  const { id } = req.params;
  const {
    name,
    label,
    status,
    total_episode,
    plot,
    cover,
    poster,
    price,
    episodes,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Title.findByIdAndUpdate(
      { _id: id },
      {
        name,
        label,
        status,
        total_episode,
        plot,
        cover,
        poster,
        price: price || 0,
        episodes,
      }
    )
      .then(() => res.json({ status: true }))
      .catch((err) => res.json({ status: false }));
  }
};
exports.delete = (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    Title.deleteOne({ _id: id }, (err, doc) => {
      //todo : remove uploaded images
      if (err) return res.json({ status: false });
      else return res.json({ status: true });
    });
  } else return res.status(400).json({ status: false });
};
