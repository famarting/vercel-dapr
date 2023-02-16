// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios"

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
        let cloudEvent = JSON.parse(req.body);

        console.log("processing order "+JSON.stringify(cloudEvent))

        let order = cloudEvent.data;

        const processed = {
            ...order,
            processed: true,
            processedAt: new Date(),
        }

        await client.state.save(config.ORDERS, [{
            key: "last",
            value: processed,
        }])
        await client.state.save(config.ORDERS, [{
            key: order.id,
            value: processed,
        }])

        // const state = [
        //     {
        //       key: "last",
        //       value: processed
        //     },
        //     {
        //       key: order.id,
        //       value: processed
        //     },
        //   ];
        // const stateStoreBaseUrl = `http://${config.DAPR_HOST}:${config.DAPR_HTTP_PORT}/v1.0/state/${config.ORDERS}`
        // await axios.post(`${stateStoreBaseUrl}`, state, {
        //     headers: {
        //         "host": config.DAPR_HOST_DOMAIN,
        //         "dapr-api-token": config.DAPR_API_TOKEN,
        //     },
        // })

        res.status(200).json({});

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
