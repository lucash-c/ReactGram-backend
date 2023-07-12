const { S3Client } = require('@aws-sdk/client-s3');

// Configuração do AWS SDK
const s3 = new S3Client({
  region: 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { s3 };