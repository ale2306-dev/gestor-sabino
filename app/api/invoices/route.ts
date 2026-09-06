import { inv_collection } from "../../db";

// Método POST
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await inv_collection.insertOne(data);

    return new Response(JSON.stringify({ insertedId: result.insertedId }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// Método GET
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (id) {
            const doc = await inv_collection.findOne({id: id});
            if (!doc) {
                return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
            }

            console.log(JSON.stringify(doc))
            return new Response(JSON.stringify(doc), { status: 200 });

  
        } else {
            const docs = await inv_collection.find({}).toArray();
            return new Response(JSON.stringify(docs), { status: 200 });
        }
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

//Método PATCH
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


        const result = await inv_collection.updateOne({ id: id }, { $set: updates });

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }

        const updatedDoc = await inv_collection.findOne({ id: id });
        return new Response(JSON.stringify(updatedDoc), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

//Método DELETE
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
        }

        const result = await inv_collection.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}