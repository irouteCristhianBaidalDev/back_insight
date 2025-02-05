import { Router } from "express";
import { getInsights, getPost } from "../controller/generalController";
const routes = Router();
// x.com
routes.get( '/x/getPosts',  getPost);
// OPEN AI
routes.post('/openai/getInsights', getInsights);

export default routes;