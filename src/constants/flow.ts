export const mustHaves = ["client", "server", "database"];

export const goodToHaves = ["load balancer", "cache", "logging", "monitoring", "api gateway"];

export const prohibitedConnections = [
  {
    connection: ["client", "database"],
    message: "You can't connect client to database directly - use an API layer instead",
  },
  {
    connection: ["client", "cache"],
    message: "Client shouldn't directly access the cache - cache should be managed by server",
  },
  {
    connection: ["load balancer", "database"],
    message:
      "Load balancer shouldn't connect directly to database - it should route to application servers",
  },
  {
    connection: ["api gateway", "database"],
    message:
      "API Gateway shouldn't connect directly to database - it should route to microservices",
  },
  {
    connection: ["monitoring", "database"],
    message:
      "Monitoring service shouldn't directly query database - it should collect metrics from application servers",
  },
  {
    connection: ["client", "message queue"],
    message: "Client shouldn't directly interact with message queues - use server endpoints",
  },
  {
    connection: ["client", "elasticsearch"],
    message: "Client shouldn't directly query search engine - route through application server",
  },
];

export const goodToHaveConnections = [
  {
    connection: ["client", "load balancer"],
    message: "Client should connect through a load balancer for better scalability",
  },
  {
    connection: ["server", "cache"],
    message: "Server should utilize caching for better performance",
  },
  {
    connection: ["server", "logging"],
    message: "Implement logging for better monitoring and debugging",
  },
  {
    connection: ["server", "monitoring"],
    message: "Server should be connected to monitoring for system health tracking",
  },
  {
    connection: ["server", "api gateway"],
    message: "Use API Gateway for better request routing and management",
  },
];

export const aiFeedbackTemplate = [
  { component: "", message: "" },
  { connection: "", message: "" },
];

[
  {
    component: "server",
    message:
      "The server is a single point of failure. Consider horizontal scaling (e.g., multiple server instances behind a load balancer) to improve availability and handle traffic spikes.",
  },
  {
    component: "database",
    message:
      "A key-value store (e.g., Redis or DynamoDB) is better suited for URL shorteners than a generic SQL database due to faster lookups. Include caching (e.g., Redis) to reduce database load for frequent redirects.",
  },
  {
    component: "client",
    message:
      "Client design should include input validation (e.g., URL format checks) and error handling (e.g., retries for failed requests).",
  },
  {
    connection: "client-server",
    message:
      "Use HTTPS/TLS to encrypt communication and prevent eavesdropping on shortened URLs. Implement rate-limiting to block abuse (e.g., bulk URL generation).",
  },
  {
    connection: "server-database",
    message:
      "Add connection pooling and retries to handle database outages. Consider read replicas to scale read-heavy redirect traffic.",
  },
  {
    component: "",
    message:
      "Missing analytics component (e.g., logging or a separate service) to track metrics like click rates or geographic distribution.",
  },
  {
    connection: "",
    message:
      "No disaster recovery mechanism (e.g., database backups or replication to another region) is specified, risking data loss.",
  },
];
