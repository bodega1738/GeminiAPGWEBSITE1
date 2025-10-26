import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register Better Auth routes with CORS enabled (required for SPA)
authComponent.registerRoutes(http, createAuth, { cors: true });

export default http;
