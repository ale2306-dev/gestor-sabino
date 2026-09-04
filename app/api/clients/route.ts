import { cli_collection } from "../../db";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Inserta en la colección (server-side)
    const result = await cli_collection.insertOne(data);

    return new Response(JSON.stringify({ insertedId: result.insertedId }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const rif = url.searchParams.get('rif');
        
        if (rif) {
            const doc = await cli_collection.findOne({ rif: rif });
            if (!doc) {
                return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
            }

            console.log(JSON.stringify(doc))
            return new Response(JSON.stringify(doc), { status: 200 });
  
        } else {
            const docs = await cli_collection.find({}).toArray();
            return new Response(JSON.stringify(docs), { status: 200 });
        }
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const url = new URL(request.url);
        const rif = url.searchParams.get('rif');

        if (!rif) {
            return new Response(JSON.stringify({ error: 'Missing RIF' }), { status: 400 });
        }

        const updates = await request.json();
        if (!updates || Object.keys(updates).length === 0) {
            return new Response(JSON.stringify({ error: 'No update fields provided' }), { status: 400 });
        }

        const result = await cli_collection.updateOne({ rif: rif }, { $set: updates });

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }

        const updatedDoc = await cli_collection.findOne({ rif: rif });
        return new Response(JSON.stringify(updatedDoc), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const rif = url.searchParams.get('rif');

        if (!rif) {
            return new Response(JSON.stringify({ error: 'Missing RIF' }), { status: 400 });
        }

        const result = await cli_collection.deleteOne({ rif: rif });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}