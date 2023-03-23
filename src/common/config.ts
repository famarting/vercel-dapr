const config = {
//   DAPR_HOST_DOMAIN: process.env.DAPR_HOST_DOMAIN || "",
  DAPR_HOST: process.env.DAPR_HOST || "http://localhost",
  DAPR_HTTP_PORT: process.env.DAPR_HTTP_PORT || "3500",
  DAPR_API_TOKEN: process.env.DAPR_API_TOKEN || "",
  PUBSUB_NAME: process.env.PUBSUB_NAME || "orderpubsub",
  PUBSUB_TOPIC: "orders",
  ORDERS: "orders",
};

export {config};
