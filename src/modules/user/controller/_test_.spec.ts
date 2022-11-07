import { ControllerUser } from "."
import { IError, IServiceUser } from "../../../interfaces_and_types"

class ErrorTest extends Error implements IError {
    readonly name = 'regNotFound';
    readonly showClient = true;
    readonly status = 404;
    constructor() {
        super(`reg not found`)
    }
}

function compateTextFilter(filter: string, text: string) {
    return text.toLowerCase().includes(filter.toLowerCase())
}

class FakeServiceUser implements IServiceUser {

    private list: { [key: string]: any } = {
        'id_1': { id: 'id_1', value: "Value 1" },
        'id_2': { id: 'id_2', value: "Value 2" },
        'id_3': { id: 'id_3', value: "Value 3" },
    };
    async insert(data: any): Promise<any> {
        this.list[data._id] = data;
    }

    async update(email: string, data: any): Promise<any> {
        this.list[email] = { ...this.list[email], ...data };
    }

    async delete(email: string): Promise<void> {
        delete this.list[email];
    }

    async getList(props: { index: number; limit: number; filter?: string }): Promise<any[]> {
        const { index, limit, filter } = props;
        const list = Object.values(this.list);
        const listLimit = list.slice(index, index + limit);
        const listFilter = !filter ? listLimit : listLimit.filter(item => compateTextFilter(filter, item.id) || compateTextFilter(filter, item.value))
        return listFilter;
    }

    async getDataByEmail(email: string): Promise<any> {
        const data = this.list[email] || null;
        if (!data)
            throw new ErrorTest();
        return data;
    }

}

const controller = new ControllerUser(new FakeServiceUser());

const errorTest = new ErrorTest();

describe('controller user', () => {

    it('get user by id', async () => {
        await getValidUser('id_3', { id: 'id_3', value: "Value 3" });
    });

    it('get user by inexistent id', async () => {
        await getInexistentUser('inexistent_id');
    });

    it(`insert, update and delete new user`, async () => {
        await getInexistentUser('test_email');

        const insertResult = await controller.insertNewUser({ body: { _id: 'test_email', value: 'Value test' } });
        expect(insertResult).toEqual({ status: 200, data: { status: 'success' } });

        await getValidUser('test_email', { _id: 'test_email', value: 'Value test' });

        const updateResult = await controller.updateUser({ params: { id: 'test_email' }, body: { value: 'Value test Update' } });
        expect(updateResult).toEqual({ status: 200, data: { status: 'success' } });

        await getValidUser('test_email', { _id: 'test_email', value: 'Value test Update' });

        const deleteResult = await controller.deleteUserByEmail({ params: { id: 'test_email' } });
        expect(deleteResult).toEqual({ status: 200, data: { status: 'success' } });

        await getInexistentUser('test_email');
    })

    it('list user', async () => {
        const listUsers = await controller.listUsers({ query: {} });
        expect(listUsers).toEqual({
            "data": [
                { "id": "id_1", "value": "Value 1" },
                { "id": "id_2", "value": "Value 2" },
                { "id": "id_3", "value": "Value 3" },
            ],
            "status": 200,
        });
        expect(listUsers.data.length).toBe(3);
    })

    it('list user with index equal the 1', async () => {
        const listUsers = await controller.listUsers({ query: { index: '1' } });
        expect(listUsers).toEqual({
            "data": [
                { "id": "id_2", "value": "Value 2" },
                { "id": "id_3", "value": "Value 3" },
            ],
            "status": 200,
        })
        expect(listUsers.data.length).toBe(2);
    })

    it('list user with limit equal the 2', async () => {
        const listUsers = await controller.listUsers({ query: { limit: "2" } });
        expect(listUsers).toEqual({
            "data": [
                { "id": "id_1", "value": "Value 1" },
                { "id": "id_2", "value": "Value 2" },
            ],
            "status": 200,
        });
        expect(listUsers.data.length).toBe(2);
    })

    it('list user with filter equal "val 2"', async () => {
        const listUsers = await controller.listUsers({ query: { filter: "lue 2" } });
        expect(listUsers).toEqual({
            "data": [
                { "id": "id_2", "value": "Value 2" },
            ],
            "status": 200,
        });
        expect(listUsers.data.length).toBe(1);
    })

})


async function getValidUser(id: string, data: any) {
    const existentUser = await controller.userByEmail({ params: { id } });
    expect(existentUser).toEqual({ data: data, status: 200 });
}

async function getInexistentUser(id: string) {
    const existentUser = await controller.userByEmail({ params: { id } });
    expect(existentUser).toEqual({ status: 404, data: { ...errorTest } });
}