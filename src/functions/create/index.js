import { v4 as uuidv4 } from 'uuid'

import { Role1View } from 'functions/BaseView'
import { put as PutItem } from 'services/DynamoDB'

const CreateView = async ({ auth: { userId }, body: data }) => {
    const TEMPLATE_NAME_SK = uuidv4()
    const pk = `USER#${userId}`
    const sk = `ORDER#${TEMPLATE_NAME_SK}`
    const item = await PutItem({ pk, sk, data })
    return { data: item, statusCode: 201 }
}

export default Role1View(CreateView)
