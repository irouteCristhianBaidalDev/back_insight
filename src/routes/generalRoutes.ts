import { Router } from "express";
import { insightsByTweets, mockGeneratePdf, tweetsForInsight } from "../controller/generalController";
const routes = Router();
// x.com
routes.post( '/x/tweets',  tweetsForInsight);
// OPEN AI
routes.post('/openai/insights', insightsByTweets);
routes.get('/openai/mockinsights', mockGeneratePdf);

export default routes;