const config = {
  DAPR_HOST: process.env.DAPR_HOST || "http://localhost",
  DAPR_HTTP_PORT: process.env.DAPR_HTTP_PORT || "3500",
  PUBSUB_NAME: "orderpubsub",
  PUBSUB_TOPIC: "orders",
  ORDERS: "orders",
};

export {config};
