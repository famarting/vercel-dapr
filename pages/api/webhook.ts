// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received webhook "+req.method + " " +req.url+ " - "+JSON.stringify(req))
    res.status(200).json({ message: "Hello from webhook", date: new Date().toString })
}
