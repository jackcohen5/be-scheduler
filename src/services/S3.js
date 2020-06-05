import { S3 } from './AWS'

const generatePresignedUrl = ({ key, action }) =>
    S3.getSignedUrl(action, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Expires: 60,
    })

export const generateDownloadUrl = key =>
    generatePresignedUrl({ key, action: 'getObject' })

export const generateUploadUrl = key =>
    generatePresignedUrl({ key, action: 'putObject' })

export default {
    generateDownloadUrl,
    generateUploadUrl,
}
