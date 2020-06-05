import { v4 as uuidv4 } from 'uuid'

import { Role1View } from 'functions/BaseView'
import { generateUploadUrl } from 'services/S3'

const UploadView = async ({ auth: { userId } }) => {
    const itemId = uuidv4()
    const key = `${userId}/${itemId}`
    const url = await generateUploadUrl(key)
    return { data: url }
}

export default Role1View(UploadView)
