import { MongoClient, Db } from 'mongodb';

export const DATABASE_URL = process.env.DATABASE_URL || '';
export const DB_NAME = process.env.DB_NAME || '';

export async function collection(collection: string) {
    const client = new MongoClient(DATABASE_URL);
    const db = client.db(DB_NAME);
    const collec = await db.collection(collection)
    return collec;
}


export class CollectionMongoDb {

    private static client: MongoClient;
    private static Db: Db;

    constructor(
        private readonly collectionName: string
    ) { }

    private defineClientConnection() {
        if (!CollectionMongoDb.client)
            CollectionMongoDb.client = new MongoClient(DATABASE_URL);
    }

    private difineDBConnection() {
        if (!CollectionMongoDb.Db)
            CollectionMongoDb.Db = CollectionMongoDb.client.db(DB_NAME);
    }

    async collection() {
        this.defineClientConnection();
        this.difineDBConnection();
        const collection = await CollectionMongoDb.Db.collection(this.collectionName);
        return collection;
    }

}
