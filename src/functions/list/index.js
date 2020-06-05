import { Role1View } from 'functions/BaseView'
import { list as ListItems } from 'services/DynamoDB'

const ListView = async ({ auth: { userId } }) => {
    const pk = `USER#${userId}`
    const items = await ListItems(pk)
    return { data: items }
}

export default Role1View(ListView)
