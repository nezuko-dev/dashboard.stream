const Content = require("../models/content");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
const crypto = require("crypto");

// file
const path = require("path");
const fs = require("fs-extra");
const uploadPath = path.join(__dirname, `${process.env.UPLOAD_PATH}/raw/`);
fs.ensureDir(uploadPath);
// stream and ffmpeg config
const ffmpeg = require("fluent-ffmpeg");
const streamPath = path.join(__dirname, `${process.env.UPLOAD_PATH}/stream/`);
fs.ensureDir(streamPath);

exports.index = async (req, res) => {
  const { status } = req.query;
  return res.json({
    status: true,
    data: await Content.find(
      req.user.role === "admin" ? { status } : { editor: req.user.id, status }
    ),
  });
};
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
          const contentPath = path.join(streamPath, stream._id.toString());
          fs.ensureDir(contentPath);
          var size = (fs.statSync(raw).size / (1024 * 1024)).toFixed(2);
          ffmpeg(raw)
            .outputOptions([
              "-map 0:v:0",
              "-map 0:a:0",
              "-map 0:v:0",
              "-map 0:a:0",
              "-map 0:v:0",
              "-map 0:a:0",
              "-map 0:v:0",
              "-map 0:a:0",
              "-filter:v:0 scale=-2:360",
              "-b:a:0 128k",
              "-filter:v:1 scale=-2:480",
              "-b:a:1 128k",
              "-filter:v:2 scale=-2:720",
              "-b:a:2 192k",
              "-filter:v:3 scale=-2:1080",
              "-b:a:3 192k",
              "-f hls",
              "-hls_time 10",
              "-hls_segment_type fmp4",
              "-hls_playlist_type vod",
              "-hls_flags independent_segments",
              `-master_pl_name master.nez`,
            ])
            .outputOption("-var_stream_map", "v:0,a:0, v:1,a:1 v:2,a:2 v:3,a:3")
            .output(`${contentPath}/%v/media.nez`)
            .on("end", (err, stdout, stderr) => {
              console.log("Converted file " + raw + " Removing...");
              // remove file
              fs.copy(
                `${contentPath}/master.nez`,
                `${contentPath}/mobile.m3u8`
              );
              fs.removeSync(raw);
              // update status and stream token
              Content.findByIdAndUpdate(
                { _id: stream._id },
                { status: "ready", size: size + "MB" }
              ).catch((err) => console.log("Failed " + err));
            })
            .on("error", (err, stdout, stderr) => {
              console.log("Invalid file " + raw + " Removing...");

              fs.removeSync(raw);
              // update status and stream token
              Content.findByIdAndUpdate(
                { _id: stream._id },
                { status: "failed", size: 0 }
              ).catch((err) => console.log("Failed " + err));
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
exports.stream = async (req, res) => {
  const { id } = req.params;
  return res.json({ status: true, data: await Content.findById(id) });
};
