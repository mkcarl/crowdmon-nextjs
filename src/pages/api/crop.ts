import {NextApiRequest, NextApiResponse} from "next";
import {MongoClient} from "mongodb";

type Data = {
    videoId: string,
    imageId: string,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    annotationClass: "paimon" | string ,
    contributorId: string,
    timestamp: number,
    base64Image?: string,
}

interface Request extends NextApiRequest{
    body: Data
}

type Response = NextApiResponse<{message: string}>

export default async function handler(req: Request, res: Response){
    if (req.method === "POST"){
        const {videoId, imageId, x, y, width, height, annotationClass, contributorId, timestamp, base64Image} = req.body


        const mongo = new MongoClient(process.env.MONGODB_URI as string)
        const db = mongo.db("crowdmon")
        const collection = db.collection("crops")
        const result = await collection.insertOne({
            videoId,
            imageId,
            timestamp: +timestamp,
            annotationClass,
            contributorId,
            annotationStartX: x?+x:null,
            annotationStartY: y?+y:null,
            annotationWidth: width?+width:null,
            annotationHeight:  height?+height:null,
            base64Image
        })
        await mongo.close()
        res.status(200)

        res.json({message: "success"})

    }
}
