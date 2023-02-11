// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';

import { config } from '../../src/common/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const client = new DaprClient(config.DAPR_HOST, config.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP, {
        daprApiToken: config.DAPR_API_TOKEN,
    });

    if (req.method === 'POST') {
        let order = req.body;

        const processed = {
            ...order,
            processed: true,
            processedAt: new Date(),
        }

        await client.state.save(config.ORDERS, [{
            key: "last",
            value: processed,
        }])

        res.status(200).end();

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
