type TPropsList = {
    index: number,
    limit: number,
    filter?: string,
}

export interface IModuleUserInsert {
    execute(data: any): Promise<void>;
}

export interface IModuleUserUpdate {
    execute(email: string, data: any): Promise<void>;
}

export interface IModuleUserDelete {
    execute(email: string): Promise<void>;
}

export interface IModuleUserListUsers {
    execute(props: TPropsList): Promise<any[]>;
}

export interface IModuleUserGetUserByEmail {
    execute(email: string): Promise<any>;
}
