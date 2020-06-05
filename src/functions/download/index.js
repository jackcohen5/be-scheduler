import { Role2View } from 'functions/BaseView'
import { generateDownloadUrl } from 'services/S3'

const DownloadView = async ({
    auth: { userId },
    pathParameters: { fileId },
}) => {
    const key = `${userId}/${fileId}`
    const url = await generateDownloadUrl(key)
    return { data: url }
}

export default Role2View(DownloadView)
