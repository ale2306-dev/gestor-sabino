import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_DB_URI as string;

// Crear cliente MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function run() {
  try {
    // Conectar cliente al sv
    await client.connect();
    // Ping
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Cerrar cliente si da error o si finaliza
    await client.close();
    console.log("closed")
  }
}

const db = client.db("gestorDB")

export const inv_collection = db.collection("invoices")
export const cli_collection = db.collection("clients")


