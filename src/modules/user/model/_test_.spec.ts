import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { ModelUser } from '.';
import { ErrorRegisterNotExists } from './ErrorRegisterNotExists';

const DATABASE_URL = process.env.DATABASE_URL || '';

const LIST_BASIC_REGISTERS = [
    { _id: 'id_test_2' as any, value: 'Value Test 2' },
    { _id: 'id_test_1' as any, value: 'Value Test 1' },
    { _id: 'id_test_3' as any, value: 'Value Test 3' },
];

async function collection() {
    const connect = await MongoClient.connect(DATABASE_URL);
    const db = connect.db('_db_test_');
    const collection = await db.collection('_test_model_user_');
    return collection;
}

describe('test model user with mongodb', () => {

    let modelUser: ModelUser;
    let collec: Awaited<ReturnType<typeof collection>>;

    beforeEach(async () => {
        collec = await collection();
        await collec.deleteMany({});
        await collec.insertMany(LIST_BASIC_REGISTERS)
        modelUser = new ModelUser(collec);
    })

    afterEach(async () => {
        collec.drop();
    })

    it('insert, update and delete collection', async () => {
        await modelUser.insert({ _id: 'id_test', value: 'Value Test' });
        const getNewUser = await modelUser.getDataById('id_test');
        expect(getNewUser).toEqual({ _id: 'id_test', value: 'Value Test' });

        await modelUser.update('id_test', { value: 'Value Test Update' });
        const getUpdateUser = await modelUser.getDataById('id_test');
        expect(getUpdateUser).toEqual({ _id: 'id_test', value: 'Value Test Update' });

        await modelUser.delete('id_test');
        await expect(async () => await modelUser.getDataById('id_test'))
            .rejects
            .toEqual(new ErrorRegisterNotExists())
    })

    it('get data by id', async () => {
        const getData2 = await modelUser.getDataById('id_test_2');
        expect(getData2).toEqual({ _id: 'id_test_2' as any, value: 'Value Test 2' })
    })

    it('get symple list datas', async () => {
        const list = await modelUser.getList({ index: 0, limit: 10 });
        expect(list.length).toBe(3);
        expect(list[0]).toEqual(LIST_BASIC_REGISTERS[1]); // the result 0 is equal the 1 because "list" is sorted
    })

    it('get list datas, but start in second register', async () => {
        const list = await modelUser.getList({ index: 1, limit: 10 });
        expect(list.length).toBe(2);
        expect(list[0]).toEqual(LIST_BASIC_REGISTERS[0]);
    })

    it('get list datas, but the limit registers showing is 1', async () => {
        const list = await modelUser.getList({ index: 0, limit: 1 });
        expect(list.length).toBe(1);
        expect(list[0]).toEqual(LIST_BASIC_REGISTERS[1]);
    })

    it('get list datas, but filter is equal the "test 3"', async () => {
        const list = await modelUser.getList({ index: 0, limit: 10, filter: 'test 3' });
        expect(list.length).toBe(1);
        expect(list[0]).toEqual(LIST_BASIC_REGISTERS[2]);
    })

})