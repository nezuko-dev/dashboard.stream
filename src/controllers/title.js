const Title = require("../models/title");
// file
const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");

const imagePath = path.join(
  __dirname,
  `${process.env.UPLOAD_PATH}/images/titles/`
);
fs.ensureDir(imagePath);
exports.index = async (req, res) => {
  return res.json({ status: true, data: await Title.find({}) });
};
exports.add = (req, res) => res.json({ status: true });
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
      fstream.on("close", async () => {
        var image = path.join(uploadPath, name);
        await sharp(image)
          .resize(1280, 720)
          .toFile(path.join(imagePath, `original-${name}`));
        await sharp(image)
          .resize(341, 192)
          .toFile(path.join(imagePath, `sm-${name}`));
      });
    }
  });
  return res.json({ status: true, type });
};
