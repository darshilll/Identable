import { Router } from "express";
import routeV1 from "./v1";

const app = Router();

app.use("/v1", routeV1);

export default app;
