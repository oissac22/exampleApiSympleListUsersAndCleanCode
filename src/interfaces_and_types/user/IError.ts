export interface IError {
    readonly name: string,
    readonly showClient: boolean,
    readonly message: string,
    readonly status: number,
}