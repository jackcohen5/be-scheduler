import { mockItems } from '../mocks'

jest.mock('services/DynamoDB', () => ({
    list: () => mockItems,
    create: () => mockItems[0],
    put: () => mockItems[0],
    get: () => mockItems[0],
    deleteItem: () => mockItems[0],
}))

jest.mock('services/S3', () => ({
    generateDownloadUrl: () => 'download-url',
    generateUploadUrl: () => 'upload-url',
}))
