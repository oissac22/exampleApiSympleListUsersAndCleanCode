import {
    IModuleUserDelete,
    IModuleUserGetUserByEmail,
    IModuleUserInsert,
    IModuleUserListUsers,
    IModuleUserUpdate,
    IServiceUserDelete,
    IServiceUserGetUserByEmail,
    IServiceUserInsert,
    IServiceUserList,
    IServiceUserUpdate
} from "../../../interfaces_and_types/index";



type TData = { _id: string; name: string; password: string; level: string; }
type TReturn = { _id: string; name: string; level: string; _dateCreated: Date; _dateUpdate: Date; }

type TDataUpdate = { name?: string; password?: string; level?: string; }
type TDataUpdateReturn = { _id: string; _dateUpdate: Date; name?: string; password?: string; level?: string; }

type TPropsList = { index: number; limit: number; filter?: string; };
type TListReturn = { _id: string; name: string; level: string; }



export class ServiceUserInsert implements IServiceUserInsert {
    constructor(
        private readonly modelUserInsert: IModuleUserInsert,
        private readonly dateNow?: Date
    ) { }

    async execute(data: TData): Promise<TReturn> {
        const writeData = {
            ...data,
            _dateCreated: this.dateNow || new Date(),
            _dateUpdate: this.dateNow || new Date(),
        }
        await this.modelUserInsert.execute(writeData);
        delete writeData.password;
        return writeData;
    }
}



export class ServiceUserUpdate implements IServiceUserUpdate {
    constructor(
        private readonly modelUserUpdate: IModuleUserUpdate,
        private readonly dateNow?: Date
    ) { }

    async execute(email: string, data: TDataUpdate): Promise<TDataUpdateReturn> {
        const writeData = {
            ...data,
            _dateUpdate: this.dateNow || new Date(),
        }
        await this.modelUserUpdate.execute(email, writeData);
        delete writeData.password;
        return { ...writeData, _id: email };
    }
}



export class ServiceUserDelete implements IServiceUserDelete {
    constructor(
        private readonly modelUserDelete: IModuleUserDelete,
    ) { }

    async execute(email: string): Promise<void> {
        await this.modelUserDelete.execute(email);
    }
}



export class ServiceUserList implements IServiceUserList {
    constructor(
        private readonly modelUserList: IModuleUserListUsers,
    ) { }

    async execute(props: TPropsList): Promise<TListReturn[]> {
        const result = await this.modelUserList.execute(props);
        return result;
    }

}



export class ServiceUserDataByEmail implements IServiceUserGetUserByEmail {

    constructor(
        private readonly modelUserData: IModuleUserGetUserByEmail,
    ) { }

    async execute(email: string): Promise<TReturn> {
        const result = await this.modelUserData.execute(email);
        return result;
    }

}