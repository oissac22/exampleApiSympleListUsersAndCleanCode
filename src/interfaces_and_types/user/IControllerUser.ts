type TKey = { [key: string]: string }

type TReturnController<T = any> = {
    data: T,
    status: number,
}

export interface IControllerUser {
    insertNewUser(props: { body: TKey }): Promise<TReturnController>;
    updateUser(props: { params: TKey, body: TKey }): Promise<TReturnController>;
    deleteUserByEmail(props: { params: TKey }): Promise<TReturnController>;
    listUsers(props: { query: TKey }): Promise<TReturnController<any[]>>;
    userByEmail(email: string): Promise<TReturnController>;
}