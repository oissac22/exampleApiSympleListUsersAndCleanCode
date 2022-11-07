import { IModuleUser } from "../../../interfaces_and_types/index"
import { ServiceUser } from "./index"

const LIST_USERS: { [key: string]: any } = {}
const FAKE_DATE = new Date();
const AFTER_DATE = (() => {
    const date = new Date(FAKE_DATE);
    date.setSeconds(date.getSeconds() + 1);
    return date;
})()


describe(`Test user service`, () => {

    beforeEach(async () => {
        await addInitialRegistersTest();
    })

    it(`insert, update and delete user`, async () => {
        checkUserNotCreated();
        await createNewUserToTest();
        checkIfUserCreated();
        await updateNameThisNewUser();
        checkIfUserIsUpdateTheName();
        await deleteThisNewUser();
        checkUserNotCreated()
    })

    it(`get user by email/_id`, async () => {
        const user = await getUserByEmail('email_test_2');
        expect(user).toEqual({ _id: 'email_test_2', level: 'level_2', name: 'Name Test2', _dateCreated: FAKE_DATE, _dateUpdate: FAKE_DATE })
    })

    it(`get list users`, async () => {
        const listUsers = await getListUsers({ index: 0, limit: 10 })
        await expectFromListUsers(listUsers, {
            lengthRegs: 3,
            resultFirstReg: {
                _dateCreated: FAKE_DATE,
                _dateUpdate: FAKE_DATE,
                _id: "email_test_1",
                level: "level_1",
                name: "Name Test1",
            }
        })
    })

    it(`get list users with index equal 1`, async () => {
        const listUsers = await getListUsers({ index: 1, limit: 10 })
        await expectFromListUsers(listUsers, {
            lengthRegs: 2,
            resultFirstReg: {
                _dateCreated: FAKE_DATE,
                _dateUpdate: FAKE_DATE,
                _id: "email_test_2",
                level: "level_2",
                name: "Name Test2",
            }
        })
    })

    it(`get list users with limit equal 2`, async () => {
        const listUsers = await getListUsers({ index: 0, limit: 2 })
        await expectFromListUsers(listUsers, {
            lengthRegs: 2,
            resultFirstReg: {
                _dateCreated: FAKE_DATE,
                _dateUpdate: FAKE_DATE,
                _id: "email_test_1",
                level: "level_1",
                name: "Name Test1",
            }
        })
    })

    it(`get list users with filter equal Test2`, async () => {
        const listUsers = await getListUsers({ index: 0, limit: 10, filter: 'test2' })
        await expectFromListUsers(listUsers, {
            lengthRegs: 1,
            resultFirstReg: {
                _dateCreated: FAKE_DATE,
                _dateUpdate: FAKE_DATE,
                _id: "email_test_2",
                level: "level_2",
                name: "Name Test2",
            }
        })
    })

})



const checkUserNotCreated = () => checkInexistentUser({ _id: 'email_test', level: 'admin', name: 'Name Test', _dateCreated: FAKE_DATE, _dateUpdate: FAKE_DATE });
const createNewUserToTest = () => insertNewUser({ _id: 'email_test', level: 'admin', name: 'Name Test', password: 'valid_password' });
const checkIfUserCreated = () => checkExistentUser({ _id: 'email_test', level: 'admin', name: 'Name Test', _dateCreated: FAKE_DATE, _dateUpdate: FAKE_DATE });
const updateNameThisNewUser = () => updateUser('email_test', { name: "Name Test Update" });
const checkIfUserIsUpdateTheName = () => checkExistentUser({ _id: 'email_test', level: 'admin', name: 'Name Test Update', _dateCreated: FAKE_DATE, _dateUpdate: AFTER_DATE });
const deleteThisNewUser = () => deleteUser('email_test');



class FakeModuleUser implements IModuleUser {

    private textFindInText(textFind: string, textFull: string) {
        return textFull.toLowerCase().includes(textFind.toLowerCase());
    }

    async insert(data: any): Promise<void> {
        LIST_USERS[data._id] = data;
    }

    async update(email: string, data: any): Promise<void> {
        if (LIST_USERS[email])
            LIST_USERS[email] = { ...LIST_USERS[email], ...data };
    }

    async delete(email: string): Promise<void> {
        delete LIST_USERS[email];
    }

    async getList(props: { index: number; limit: number; filter?: string; }): Promise<any[]> {
        const { index, limit, filter } = props;
        const list = Object.values(LIST_USERS);
        const listFilter = filter ?
            list.filter(item =>
                this.textFindInText(filter, item._id)
                || this.textFindInText(filter, item.name)
                || this.textFindInText(filter, item.level)
            ) :
            list;
        const listLimit = listFilter.slice(index, index + limit);
        return listLimit;
    }

    async getDataById(email: string): Promise<any> {
        return LIST_USERS[email] || null;
    }

}



async function insertNewUser(data: { _id: string, level: string, name: string, password: string }) {
    const serviceUser = new ServiceUser(new FakeModuleUser())
    const result = await serviceUser.insert(data, FAKE_DATE);
    expect(result).toEqual({
        _dateCreated: FAKE_DATE,
        _dateUpdate: FAKE_DATE,
        _id: data._id,
        level: data.level,
        name: data.name
    })
}

async function updateUser(email: string, data: { level?: string, name?: string, password?: string }) {
    const serviceUser = new ServiceUser(new FakeModuleUser())
    const result = await serviceUser.update(email, data, AFTER_DATE);
    const { password, ...returnData } = data;
    expect(result).toEqual({
        ...returnData,
        _id: email,
        _dateUpdate: AFTER_DATE,
    })
}

async function deleteUser(email: string) {
    const serviceUser = new ServiceUser(new FakeModuleUser());
    await serviceUser.delete(email);
}

function checkExistentUser(data: { _id: string, level: string, name: string, _dateCreated: Date, _dateUpdate: Date }) {
    const user = LIST_USERS[data._id] || null;
    expect(user).toEqual(data);
}

function checkInexistentUser(data: { _id: string, level: string, name: string, _dateCreated: Date, _dateUpdate: Date }) {
    const user = LIST_USERS[data._id] || null;
    expect(user).toBe(null);
}

async function addInitialRegistersTest() {
    const serviceUser = new ServiceUser(new FakeModuleUser());
    await serviceUser.insert({ _id: 'email_test_1', level: 'level_1', name: 'Name Test1', password: '****' }, FAKE_DATE);
    await serviceUser.insert({ _id: 'email_test_2', level: 'level_2', name: 'Name Test2', password: '****' }, FAKE_DATE);
    await serviceUser.insert({ _id: 'email_test_3', level: 'level_3', name: 'Name Test3', password: '****' }, FAKE_DATE);
}

async function getListUsers(props: { index: number, limit: number, filter?: string }) {
    const { index, limit, filter } = props;
    const serviceUser = new ServiceUser(new FakeModuleUser());
    const result = await serviceUser.getList({ index, limit, filter });
    return result;
}

async function expectFromListUsers(
    listUsers: any,
    props: {
        lengthRegs: number,
        resultFirstReg: {
            _dateCreated?: Date,
            _dateUpdate?: Date,
            _id?: string,
            level?: string,
            name?: string,
        }
    }
) {
    const { lengthRegs, resultFirstReg } = props;
    expect(listUsers.length).toBe(lengthRegs);
    expect(listUsers[0]).toEqual(resultFirstReg)
}

async function getUserByEmail(email: string) {
    const serviceUser = new ServiceUser(new FakeModuleUser())
    const result = await serviceUser.getDataByEmail(email);
    return result;
}