const express = require("express")
const multer = require("multer")
const cors = require("cors")
const s3 = require("./s3")
const app = express()
app.use(cors())
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fieldSize: 50 * 1024 * 1024 },
})

app.post("/upload", upload.single("file"), function (req, res, next) {
    const params = {
        Bucket: "minted-music",
        Key: req.body.key,
        Body: req.file.buffer,
        ACL: "public-read",
    }

    s3.upload(params, function (err, data) {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        } else {
            res.json({ location: data.Location })
        }
    })
})

app.listen(8080, () => console.log("Server started on port 8080"))
