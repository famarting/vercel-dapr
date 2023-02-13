// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';

import { config } from '../../src/common/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received orders request "+req.method + " "+req.url)

    const client = new DaprClient(config.DAPR_HOST, config.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP, {
        daprApiToken: config.DAPR_API_TOKEN,
    });

    if (req.method === 'POST') {

        console.log("publishing new order");

        let order = req.body;

        let result = await client.pubsub.publish(config.PUBSUB_NAME, config.PUBSUB_TOPIC, order)
    
        if (result) {
            res.status(200).json({ result })
        } else {
            res.status(400).json({ error: "error publishing order" })
        }
    } else if (req.method === 'GET') {

        console.log("reading last order processed");

        let result = await client.state.get(config.ORDERS, "last")
        res.status(200).json({ result })

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
