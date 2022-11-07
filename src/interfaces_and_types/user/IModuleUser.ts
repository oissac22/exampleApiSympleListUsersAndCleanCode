type TPropsList = {
    index: number,
    limit: number,
    filter?: string,
}

export interface IModuleUser {
    insert(data: any): Promise<void>;
    update(_id: string, data: any): Promise<void>;
    delete(_id: string): Promise<void>;
    getList(props: TPropsList): Promise<any[]>;
    getDataById(_id: string): Promise<any>;
}