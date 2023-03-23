// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios"

import { config } from '../../src/common/config';
import { randomUUID } from 'crypto';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received periodic orders generator tick "+req.method + " "+req.url)

    const client = new DaprClient(config.DAPR_HOST, config.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP, {
        daprApiToken: config.DAPR_API_TOKEN,
    });

    if (req.method === 'POST') {
        console.log("generating random order")
        if (req.body) {
            let cloudEvent = JSON.parse(req.body);

            console.log("received body "+JSON.stringify(cloudEvent))
        }

        const order = {
            id: randomUUID(),
            item: "foo"
        };

        let result = await client.pubsub.publish(config.PUBSUB_NAME, config.PUBSUB_TOPIC, order)
        console.log("random orger published "+result)

        res.status(200).json({});

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
