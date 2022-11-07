
type TUserDataInsert = {
    _id: string,
    name: string,
    password: string,
    level: string,
}

type TUserDataUpdate = {
    name?: string,
    password?: string,
    level?: string,
}

type TPropsList = {
    index: number,
    limit: number,
    filter?: string,
}

type TReturnInsertUser = {
    _id: string,
    name: string,
    level: string,
    _dateCreated: Date,
    _dateUpdate: Date,
}

type TReturnUpdateUser = {
    _id: string,
    name?: string,
    level?: string,
    _dateUpdate: Date,
}

type TDataFromList = {
    _id: string,
    name: string,
    level: string,
}

type TReturnUser = TReturnInsertUser;

export interface IServiceUser {
    insert(data: TUserDataInsert): Promise<TReturnInsertUser>;
    update(email: string, data: TUserDataUpdate): Promise<TReturnUpdateUser>;
    delete(email: string): Promise<void>;
    getList(props: TPropsList): Promise<TDataFromList[]>;
    getDataByEmail(email: string): Promise<TReturnUser>;
}