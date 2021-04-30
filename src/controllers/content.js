const Content = require("../models/content");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
const crypto = require("crypto");
// file
const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");
const uploadPath = path.join(__dirname, `${process.env.UPLOAD_PATH}/raw/`);
const imagePath = path.join(__dirname, `${process.env.UPLOAD_PATH}/images/`);
fs.ensureDir(uploadPath);
fs.ensureDir(imagePath);
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
    ).sort({ created: -1 }),
  });
};
exports.add = (req, res) => {
  const { name, filename } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    const raw = path.join(uploadPath, filename);
    fs.pathExists(raw, async (err, exists) => {
      if (exists) {
        /* 
        1280px - 720
        854px - 480
        640px - 360
        */
        Content.create({ name, editor: req.user.id }).then((stream) => {
          const contentPath = path.join(streamPath, stream._id.toString());
          fs.ensureDir(contentPath);
          var size = (fs.statSync(raw).size / (1024 * 1024)).toFixed(2);
          let optionSync = () => {
            return new Promise((resolve, reject) => {
              ffmpeg.ffprobe(raw, (err, data) => {
                const { width } = data.streams[0];
                if (err) reject(new Error(err));
                if (width >= 640 && width < 854) {
                  resolve({
                    map: "v:0,a:0",
                    output: [
                      "-map 0:v:0",
                      "-map 0:a:0",
                      "-filter:v:0 scale=-2:360",
                      "-b:a:0 128k",
                    ],
                  });
                } else if (width >= 854 && width < 1280) {
                  resolve({
                    map: "v:0,a:0, v:1,a:1",
                    output: [
                      "-map 0:v:0",
                      "-map 0:a:0",
                      "-map 0:v:0",
                      "-map 0:a:0",
                      "-filter:v:0 scale=-2:360",
                      "-b:a:0 128k",
                      "-filter:v:1 scale=-2:480",
                      "-b:a:1 128k",
                    ],
                  });
                } else if (width >= 1280 && width < 1920) {
                  resolve({
                    map: "v:0,a:0, v:1,a:1 v:2,a:2",
                    output: [
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
                    ],
                  });
                } else if (width >= 1920) {
                  resolve({
                    map: "v:0,a:0, v:1,a:1 v:2,a:2 v:3,a:3",
                    output: [
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
                    ],
                  });
                }
              });
            });
          };
          optionSync().then(async (option) => {
            var output = option.output.concat([
              "-f hls",
              "-hls_time 2",
              "-hls_segment_type fmp4",
              "-hls_playlist_type vod",
              "-hls_flags independent_segments",
              `-master_pl_name master.nez`,
            ]);
            var name = `${crypto.randomBytes(12).toString("hex")}.png`;
            await ffmpeg(raw).screenshots({
              timestamps: ["30"],
              filename: `original-${name}`,
              folder: imagePath,
              size: "1280x720",
            });
            await ffmpeg(raw).screenshots({
              timestamps: ["30"],
              filename: `sm-${name}`,
              folder: imagePath,
              size: "341x192",
            });
            ffmpeg(raw)
              .outputOptions(output)
              .outputOption("-var_stream_map", option.map)
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
                  {
                    status: "ready",
                    size: size + "MB",
                    "thumbnail.sm": `/content/images/sm-${name}`,
                    "thumbnail.original": `/content/images/original-${name}`,
                  }
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
          });

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
exports.delete = (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    Content.findOne(
      req.user.role === "admin" ? { _id: id } : { editor: req.user.id, _id: id }
    ).then((data) => {
      const { sm, original } = data.thumbnail;
      fs.removeSync(
        path.join(
          imagePath,
          original.split("/")[original.split("/").length - 1]
        )
      );
      fs.removeSync(
        path.join(imagePath, sm.split("/")[original.split("/").length - 1])
      );
      Content.deleteOne({ _id: id }, (err) => {
        if (err) return res.json({ status: false });
        else {
          var remove = streamPath + id;
          fs.removeSync(remove);
          return res.json({ status: true });
        }
      });
    });
  } else return res.status(400).json({ status: false });
};
exports.stream = async (req, res) => {
  const { id } = req.params;
  return res.json({ status: true, data: await Content.findById(id) });
};
exports.image = (req, res) => {
  const { id } = req.params;
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
        // do not store junks
        Content.findById(id)
          .select("thumbnail")
          .then((data) => {
            const { sm, original } = data.thumbnail;
            fs.removeSync(
              path.join(
                imagePath,
                original.split("/")[original.split("/").length - 1]
              )
            );
            fs.removeSync(
              path.join(
                imagePath,
                sm.split("/")[original.split("/").length - 1]
              )
            );
          });
        // remove it
        fs.removeSync(image);
        // save it
        Content.findOneAndUpdate(
          req.user.role === "admin"
            ? { _id: id }
            : { editor: req.user.id, _id: id },
          {
            "thumbnail.sm": `/content/images/sm-${name}`,
            "thumbnail.original": `/content/images/original-${name}`,
          }
        )
          .then(() => res.json({ status: true, filename: name }))
          .catch((err) => res.json({ status: false }));
      });
    }
  });
};
