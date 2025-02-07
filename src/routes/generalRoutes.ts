import { Router } from "express";
import { insightsByTweets, tweetsForInsight } from "../controller/generalController";
const routes = Router();
// x.com
routes.post( '/x/tweets',  tweetsForInsight);
// OPEN AI
routes.post('/openai/insights', insightsByTweets);

export default routes;