import {
    IModuleUser,
    IServiceUser,
} from "../../../interfaces_and_types/index";



type TData = { _id: string; name: string; password: string; level: string; }
type TReturn = { _id: string; name: string; level: string; _dateCreated: Date; _dateUpdate: Date; }

type TDataUpdate = { name?: string; password?: string; level?: string; }
type TDataUpdateReturn = { _id: string; _dateUpdate: Date; name?: string; password?: string; level?: string; }

type TPropsList = { index: number; limit: number; filter?: string; };
type TListReturn = { _id: string; name: string; level: string; }


export class ServiceUser implements IServiceUser {

    constructor(
        private readonly modelUser: IModuleUser,
    ) { }

    async insert(data: TData, dateNow: Date = new Date()): Promise<TReturn> {
        const writeData = {
            ...data,
            _dateCreated: dateNow,
            _dateUpdate: dateNow,
        }
        await this.modelUser.insert(writeData);
        delete writeData.password;
        return writeData;
    }

    async update(email: string, data: TDataUpdate, dateNow: Date = new Date()): Promise<TDataUpdateReturn> {
        const writeData = {
            ...data,
            _dateUpdate: dateNow || new Date(),
        }
        await this.modelUser.update(email, writeData);
        delete writeData.password;
        return { ...writeData, _id: email };
    }

    async delete(email: string): Promise<void> {
        await this.modelUser.delete(email);
    }

    async getList(props: TPropsList): Promise<TListReturn[]> {
        return await this.modelUser.getList(props);
    }

    async getDataByEmail(email: string): Promise<TReturn> {
        return await this.modelUser.getDataByEmail(email);
    }

}