const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../config/config");

const s3 = new S3Client({
  region: config.AWS.S3.region,
  credentials: {
    accessKeyId: config.AWS.S3.accessKey,
    secretAccessKey: config.AWS.S3.secretKey,
  },
});

const deleteImageBylink = async (link) => {
  try {
    const key = link.split("/").slice(-1)[0];
    const command = new DeleteObjectCommand({ Key: key, Bucket: config.AWS.S3.name });
    const response = await s3.send(command);
    return response;
  } catch (e) {
    console.log("unable to delete obj from bucket", e);
    return false;
  }
};

module.exports = { deleteImageBylink };
