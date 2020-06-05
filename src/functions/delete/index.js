import { Role1View } from 'functions/BaseView'
import { deleteItem as DeleteItem } from 'services/DynamoDB'

const DeleteView = async ({
    auth: { userId },
    pathParameters: { TEMPLATE_NAME_SK },
}) => {
    const pk = `USER#${userId}`
    const sk = `ORDER#${TEMPLATE_NAME_SK}`
    const item = await DeleteItem({ pk, sk })
    return { data: item }
}

export default Role1View(DeleteView)
