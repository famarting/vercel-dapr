// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';

import { config } from '../../src/common/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received process orders request "+req.method + " "+req.url)

    const client = new DaprClient(config.DAPR_HOST, config.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP, {
        daprApiToken: config.DAPR_API_TOKEN,
    });

    if (req.method === 'POST' && req.body) {
        let order = JSON.parse(req.body);

        console.log("processed order "+order?.id)

        const processed = {
            ...order,
            processed: true,
            processedAt: new Date(),
        }

        await client.state.save(config.ORDERS, [{
            key: "last",
            value: processed,
        }])

        res.status(200).json({});

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
