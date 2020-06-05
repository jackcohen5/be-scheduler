import { Role1View } from 'functions/BaseView'
import { get as GetItem } from 'services/DynamoDB'

const GetView = async ({
    auth: { userId },
    pathParameters: { TEMPLATE_NAME_SK },
}) => {
    const pk = `USER#${userId}`
    const sk = `ORDER#${TEMPLATE_NAME_SK}`
    const item = await GetItem({ pk, sk })
    return { data: item }
}

export default Role1View(GetView)
