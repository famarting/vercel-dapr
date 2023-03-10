// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient, LogLevel } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios"

import { config } from '../../../src/common/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received get order request "+req.method + " "+req.url)

    const { orderId } = req.query

    if (!orderId) {
        res.status(401).json({ error: "bad request" })
        return
    }

    const client = new DaprClient(config.DAPR_HOST, config.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP, {
        daprApiToken: config.DAPR_API_TOKEN,
        logger: {
            level: LogLevel.Debug,
        },
    });

    if (req.method === 'GET') {

        let result = await client.state.get(config.ORDERS, orderId.toString())

        // const stateStoreBaseUrl = `http://${config.DAPR_HOST}:${config.DAPR_HTTP_PORT}/v1.0/state/${config.ORDERS}`
        // const orderResponse = await axios.get(`${stateStoreBaseUrl}/${orderId}`, {
        //     headers: {
        //         "host": config.DAPR_HOST_DOMAIN,
        //         "dapr-api-token": config.DAPR_API_TOKEN,
        //     },
        // })
        // let result = orderResponse.data;

        res.status(200).json({ result })

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
