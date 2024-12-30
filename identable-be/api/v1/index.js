import { Router } from "express";
const app = Router();

import auth from "./auth";
import plan from "./plan";
import billing from "./billing";
import user from "./user";
import automation from "./automation";
import general from "./general";
import webhook from "./webhook";
import trendingNews from "./trendingNews";
import inspireMe from "./inspireMe";
import post from "./post";
import carousel from "./carousel";
import aivideo from "./aivideo";
import dashboard from "./dashboard";
import oneClick from "./oneClick";
import articleGeneration from "./articleGeneration";
import crm from "./crm";
import aiimage from "./aiimage";
import admin from "./admin";
import brandKit from "./brandKit";
import adCreative from "./adCreative";
import article from "./article";

/*********** Combine all Routes ********************/

app.use("/auth", auth);
app.use("/plan", plan);
app.use("/billing", billing);
app.use("/user", user);
app.use("/automation", automation);
app.use("/general", general);
app.use("/webhook", webhook);
app.use("/trendingNews", trendingNews);
app.use("/inspireMe", inspireMe);
app.use("/post", post);
app.use("/carousel", carousel);
app.use("/aivideo", aivideo);
app.use("/dashboard", dashboard);
app.use("/oneClick", oneClick);
app.use("/articleGeneration", articleGeneration);
app.use("/crm", crm);
app.use("/aiimage", aiimage);
app.use("/admin", admin);
app.use("/brandKit", brandKit);
app.use("/adCreative", adCreative);
app.use("/article", article);

export default app;
