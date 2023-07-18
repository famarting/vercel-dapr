// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received test call "+req.method + " " +req.url)

    let response = { message: "Hello from webhook", date: new Date().toString, requestBody: null };
    if (req.body) {
        response.requestBody = req.body;
    }
    res.status(200).json(response)
}
