export const requiredNodes = ["client", "server", "database"];

export const goodNodes = ["load balancer", "cache"];

export const faultyEdges = [
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

export const goodEdges = [
  {
    connection: ["client", "load balancer"],
    message: "Client should connect through a load balancer for better scalability",
  },
  {
    connection: ["server", "cache"],
    message: "Server should utilize caching for better performance",
  },
];

export const iconNodes = new Set([
  "API Gateway",
  "AWS",
  "Azure",
  "Blob Storage",
  "CDN",
  "Cloudflare",
  "Docker",
  "Firebase",
  "GitHub",
  "Google Cloud",
  "Heroku",
  "Jira",
  "Kubernetes",
  "Key Value Storage",
  "Load Balancer",
  "Message Queue",
  "MongoDB",
  "Monitoring System",
  "Netlify",
  "Nginx",
  "Postgres",
  "Rate Limiter",
  "Redis",
  "Vercel",
]);

export const shapeNodes = ["circle"];
