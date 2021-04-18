const Content = require("../models/content");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
const crypto = require("crypto");

// file
const path = require("path");
const fs = require("fs-extra");
const uploadPath = path.join(__dirname, process.env.UPLOAD_PATH);
fs.ensureDir(uploadPath);
// stream and ffmpeg config
const ffmpeg = require("fluent-ffmpeg");
const streamPath = path.join(__dirname, `${process.env.UPLOAD_PATH}/stream`);
fs.ensureDir(streamPath);

exports.index = async (req, res) =>
  res.json({
    status: true,
    data: await Content.find(
      req.user.role === "admin" ? {} : { editor: req.user.id }
    ),
  });
exports.add = (req, res) => {
  const { name, filename } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    const raw = path.join(uploadPath, filename);
    fs.pathExists(raw, (err, exists) => {
      if (exists) {
        Content.create({ name, editor: req.user.id }).then((stream) => {
          var token = crypto.randomBytes(20).toString("hex");
          const contentPath = path.join(streamPath, `/${stream._id}`);
          fs.ensureDir(contentPath);
          var size = (fs.statSync(raw).size / (1024 * 1024)).toFixed(2);
          ffmpeg(raw)
            .outputOptions([
              "-codec: copy",
              "-hls_time 2",
              "-hls_playlist_type vod",
              "-hls_allow_cache 1",
              `-hls_segment_filename ${contentPath}/seg-%d.ts`,
            ])
            .output(`${contentPath}/${token}.m3u8`)
            .on("end", (err, stdout, stderr) => {
              // remove file
              fs.removeSync(raw);
              // update status and stream token
              Content.findByIdAndUpdate(
                { _id: stream._id },
                { status: true, stream: token, size }
              ).catch((err) => console.log(err));
            })
            .run();
          return res.json({ status: true });
        });
      } else
        return res.status(400).json({
          status: false,
          errors: [{ param: "file", msg: "Файл олдсонгүй" }],
        });
    });
  }
};
exports.upload = (req, res) => {
  req.pipe(req.busboy); // Pipe it trough busboy
  req.busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    /*   
        "The official mimetype of an MKV file is video/x-matroska"
        This is unfortunately not true. IANA still hasn't endorsed it in its list of official MIME types.
    */
    if ("video/mp4" !== mimetype && "application/octet-stream" !== mimetype) {
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
      fstream.on("close", () => res.json({ status: true, filename: name }));
    }
  });
};
exports.delete = (req, res) => res.json({ status: true });
