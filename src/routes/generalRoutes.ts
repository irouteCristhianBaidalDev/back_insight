import { Router } from "express";
import { insightsByTweets, newTweetsForInsight, tweetsForInsight } from "../controller/generalController";
const routes = Router();
// x.com
routes.post( '/x/tweets',  tweetsForInsight);
// OPEN AI
routes.post('/openai/insights', insightsByTweets);
// ALTERNATIVA A X
routes.post('/x/tweets/v2', newTweetsForInsight );

export default routes;