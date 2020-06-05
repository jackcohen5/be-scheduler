import { Role1View } from 'functions/BaseView'
import { put as PutItem } from 'services/DynamoDB'

const PutView = async ({
    auth: { userId },
    body: data,
    pathParameters: { TEMPLATE_NAME_SK },
}) => {
    const pk = `USER#${userId}`
    const sk = `ORDER#${TEMPLATE_NAME_SK}`
    const item = await PutItem({ pk, sk, data })
    return { data: item }
}

export default Role1View(PutView)
