
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

export interface IServiceUserInsert {
    execute(data: TUserDataInsert): Promise<TReturnInsertUser>;
}

export interface IServiceUserUpdate {
    execute(email: string, data: TUserDataUpdate): Promise<TReturnUpdateUser>;
}

export interface IServiceUserDelete {
    execute(email: string): Promise<void>;
}

export interface IServiceUserList {
    execute(props: TPropsList): Promise<TDataFromList[]>;
}

export interface IServiceUserGetUserByEmail {
    execute(email: string): Promise<TReturnUser>;
}
