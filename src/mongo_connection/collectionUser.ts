import { CollectionMongoDb } from "./CollectionMongoDb";



export async function collectionUser() {
    const collectionClass = new CollectionMongoDb('users');
    return collectionClass.collection();
}
