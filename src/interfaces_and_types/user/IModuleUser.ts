type TPropsList = {
    index: number,
    limit: number,
    filter?: string,
}

export interface IModuleUser {
    insert(data: any): Promise<void>;
    update(email: string, data: any): Promise<void>;
    delete(email: string): Promise<void>;
    getList(props: TPropsList): Promise<any[]>;
    getDataByEmail(email: string): Promise<any>;
}