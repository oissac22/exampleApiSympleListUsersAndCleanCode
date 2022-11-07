import { Collection } from "mongodb";
import { IModuleUser } from "../../../interfaces_and_types/index";
import { ErrorRegisterNotExists } from "./ErrorRegisterNotExists";

type TPropsList = {
    index: number;
    limit: number;
    filter?: string;
}

function strToRegExp(text: string): RegExp {
    return eval(`/${text.replace(/[^a-zA-Z0-9]+/g, '.*')}/i`);
}

export class ModelUser implements IModuleUser {

    constructor(
        private collection: Collection
    ) { }

    private pipeline(props: TPropsList) {
        const pipeline: any[] = [];
        if (props.filter) {
            const filter = strToRegExp(props.filter);
            pipeline.push({
                $match: {
                    $or: [
                        { _id: filter },
                        { _id: filter },
                    ]
                }
            });
        }
        pipeline.push({ $sort: { value: 1 } });
        pipeline.push({ $skip: props.index })
        pipeline.push({ $limit: props.limit })
        return pipeline;
    }

    async insert(data: any): Promise<void> {
        await this.collection.insertOne(data);
    }

    async update(_id: string, data: any): Promise<void> {
        const { matchedCount } = await this.collection.updateOne({ _id }, { $set: data });
    }

    async delete(_id: string): Promise<void> {
        const { deletedCount } = await this.collection.deleteOne({ _id });
        if (deletedCount === 0)
            throw new ErrorRegisterNotExists();
    }

    async getList(props: TPropsList): Promise<any[]> {
        const cursor = this.collection.aggregate(this.pipeline(props));
        return await cursor.toArray();
    }

    async getDataById(_id: string): Promise<any> {
        const result = await this.collection.findOne({ _id });
        if (!result)
            throw new ErrorRegisterNotExists();
        return result;
    }

}

export { ErrorRegisterNotExists }