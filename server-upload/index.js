
const S3_REGION = process.env.S3_REGION
const S3_HOST = process.env.S3_HOST
const S3_BUCKET = process.env.S3_BUCKET
const S3_KEY = process.env.S3_KEY
const S3_SECRET = process.env.S3_SECRET
const PORT = process.env.PORT || 3000
const UPLOAD_LIMIT = process.env.UPLOAD_LIMIT || '4mb'

const cors = require("cors");
const Express = require("express");
const Multer = require("multer");
const Minio = require("minio");
const BodyParser = require("body-parser");
const app = Express();

app.use(BodyParser.json({ limit: UPLOAD_LIMIT }));

const minioClient = new Minio.Client({
    endPoint: 's3',
    port: 9000,
    useSSL: false,
    accessKey: S3_KEY,
    secretKey: S3_SECRET
});

app.use(cors())
app.post("/upload", Multer({ storage: Multer.memoryStorage() }).single("file"),
    (request, response) => minioClient
        .putObject(
            S3_BUCKET,
            request.file.originalname,
            request.file.buffer,
            (error, etag) => {
                if (error) {
                    console.log(error);
                }
                response.send(request.file);
            }));

app.get("/download/:filename",
    (req, res) => minioClient
        .getObject(
            S3_BUCKET,
            req.params.filename,
            (error, stream) => {
                if (error) {
                    res.status(500).send(error);
                }
                stream.pipe(res);
            })
)

minioClient.bucketExists(S3_BUCKET, (error) => {
    if (error) {
        return console.log(error);
    }
    app.listen(PORT, () => console.log("Listening on port %s...", PORT));
});