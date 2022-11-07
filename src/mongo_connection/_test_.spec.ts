import 'dotenv/config'
import { CollectionMongoDb } from './CollectionMongoDb'

describe('mongodb database', () => {

    it('test connection', async () => {
        const collectionClass = new CollectionMongoDb('_test_');
        await collectionClass.collection();
    })

})