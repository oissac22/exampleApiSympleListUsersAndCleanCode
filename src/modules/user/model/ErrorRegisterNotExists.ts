import { IError } from "../../../interfaces_and_types/index";


export class ErrorRegisterNotExists extends Error implements IError {
    readonly name = 'notExists';
    readonly showClient = true;
    readonly status = 404;
    constructor() {
        super(`O registro não foi encontrado`);
    }
}
