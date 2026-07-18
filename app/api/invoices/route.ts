import { collection } from "../../db";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Inserta en la colección (server-side)
    const result = await collection.insertOne(data);

    return new Response(JSON.stringify({ insertedId: result.insertedId }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (id) {
            const doc = await collection.findOne({id: id});
            if (!doc) {
                return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
            }

            console.log(JSON.stringify(doc))
            return new Response(JSON.stringify(doc), { status: 200 });

  
        } else {
            const docs = await collection.find({}).toArray();
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
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
        }

        const updates = await request.json();
        if (!updates || Object.keys(updates).length === 0) {
            return new Response(JSON.stringify({ error: 'No update fields provided' }), { status: 400 });
        }


        const result = await collection.updateOne({ id: id }, { $set: updates });

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }

        const updatedDoc = await collection.findOne({ id: id });
        return new Response(JSON.stringify(updatedDoc), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
        }

        const result = await collection.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}