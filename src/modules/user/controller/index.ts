import { IControllerUser, IError, IServiceUser } from "../../../interfaces_and_types";

type TKey = { [key: string]: string; };
type TReturn = { data: any; status: number; };
type TReturnList = { data: any[]; status: number; };

export class ControllerUser implements IControllerUser {

    constructor(
        readonly service: IServiceUser
    ) { }

    private verifyError(e: any) {
        const err = e as IError;
        if (err.showClient) {
            return this.validReturn({ ...err }, err.status);
        } else {
            return this.validReturn({ status: 'error' }, 500);
        }
    }

    private validReturn(data: any, status: number) {
        return {
            data,
            status,
        }
    }

    async insertNewUser(props: { body: TKey }): Promise<TReturn> {
        try {
            await this.service.insert((props.body || {}) as any)
            return this.validReturn({ status: 'success' }, 200)
        } catch (e: any) {
            return this.verifyError(e);
        }
    }

    async updateUser(props: { params: TKey, body: TKey }): Promise<TReturn> {
        try {
            await this.service.update(props.params.id || '', (props.body || {}) as any)
            return this.validReturn({ status: 'success' }, 200)
        } catch (e: any) {
            return this.verifyError(e);
        }
    }

    async deleteUserByEmail(props: { params: TKey }): Promise<TReturn> {
        try {
            await this.service.delete(props.params.id || '')
            return this.validReturn({ status: 'success' }, 200)
        } catch (e: any) {
            return this.verifyError(e);
        }
    }

    async listUsers(props: { query: TKey }): Promise<TReturnList> {
        try {
            const list = await this.service.getList({
                index: Number(props.query.index || 0),
                limit: Number(props.query.limit || 10),
                filter: props.query.filter || '',
            })
            return this.validReturn(list, 200)
        } catch (e: any) {
            return this.verifyError(e);
        }
    }

    async userByEmail(props: { params: TKey }): Promise<TReturn> {
        try {
            const { id = '' } = props.params;
            const resultService = await this.service.getDataByEmail(id);
            return this.validReturn(resultService, 200);
        } catch (e: any) {
            return this.verifyError(e);
        }
    }

}