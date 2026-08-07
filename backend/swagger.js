import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KALAKOSH API",
      version: "1.0.0",
      description: "API documentation for KALAKOSH E-commerce Platform",
    },
    servers: [
      { url: "https://kalakosh-e-commerce-platform.onrender.com", description: "Production" },
      { url: "http://localhost:5000", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // relative to backend root where server.js runs
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
