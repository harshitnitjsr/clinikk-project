const express = require("express")
const { HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const s3 = require("../config/awsConfig")

const router = express.Router()
const bucketName = process.env.AWS_S3_BUCKET_NAME

router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params
    const params = { Bucket: bucketName, Key: `media/${key}` }

    const head = await s3.send(new HeadObjectCommand(params))
    const fileSize = head.ContentLength
    const range = req.headers.range

    if (range) {
      const [start, end] = range
        .replace(/bytes=/, "")
        .split("-")
        .map(Number)
      const chunkStart = start || 0
      const chunkEnd = end || fileSize - 1
      const chunkSize = chunkEnd - chunkStart + 1

      res.writeHead(206, {
        "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": head.ContentType,
      })

      const stream = (
        await s3.send(
          new GetObjectCommand({
            ...params,
            Range: `bytes=${chunkStart}-${chunkEnd}`,
          })
        )
      ).Body
      stream.pipe(res)
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": head.ContentType,
      })

      const stream = (await s3.send(new GetObjectCommand(params))).Body
      stream.pipe(res)
    }
  } catch (error) {
    console.error("Error streaming file:", error)
    res
      .status(500)
      .json({ error: "Error streaming file", details: error.message })
  }
})

module.exports = router;
