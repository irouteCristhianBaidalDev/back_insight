import { Request, Response } from "express";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
// import { responseX } from '../data/x_response'
// import { responseX } from '../data/x_response_celec';
import responseX from '../data/x_variety_data';
import fs, { stat } from "fs";
import { generatePDF } from "../utils/generatePDF";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { ResponseX } from "../models";
import { RequestTweets } from "../dto";
import { generateQueryGetTweets } from "../utils";
import { Proyecto } from "../models/response.api.openai";
import { configModelOpenAIGenerateInsigths } from "../config/role.openai";
import { generateInformeHTML } from "../utils/generateHTML";

dotenv.config();


const BEARER_TOKEN_TWITTER = process.env.BEARER_TOKEN_TWITTER || "";
const BEARER_TOKEN_OPENAI = process.env.BEARER_TOKEN_OPENAI || "";

const BASE_URL_TWITTER = process.env.BASE_URL_TWITTER || "";
// tweets
export const tweetsForInsight = async ( req: Request, res: Response) => {
    const { cuentas, keywords, start_date, end_date } = req.body as RequestTweets;
    const fieldsResponse = "tweet.fields=id,edit_history_tweet_ids,article,created_at,text,geo"
    let query = generateQueryGetTweets( cuentas, keywords );
    let response: ResponseX = {
        data : [],
        meta: {
            newest_id: "",
            oldest_id: "",
            result_count: 0
        }
    };
    if( !cuentas || !keywords || !start_date || !end_date ){
        res.status( 400 ).json({
            msg: "Faltan parametros para la ejecución de la consulta"
        });
    }

    if(
        cuentas.length === 0 ||
        keywords.length === 0 ||
        start_date.trim().length === 0 ||
        end_date.trim().length === 0
    ){
        res.status( 400 ).json({
            msg: "Faltan parametros para la ejecución de la consulta"
        })
    }
    
    await fetch(
        `${ BASE_URL_TWITTER}/tweets/search/recent?query=${ query.trim() }&${fieldsResponse}`,
        {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN_TWITTER}`
            }
        }
    )
    .then( responseX =>  responseX.json() )
    .then( (responseX: ResponseX) => {
        response = responseX
    })
    .catch( e => {
        console.log( e );
        res.status( 500 ).json({
            msg: e
        });
    });

    res.status( 200 ).json({ response });
}

// GENERAR INSIGHTS
export const insightsByTweets = async( req: Request, res: Response ) => {
    try{
        const openai = new OpenAI({
            apiKey: BEARER_TOKEN_OPENAI,
        });
    
        const completion = openai.chat.completions.create({
            model: "gpt-4o",
            // model: "gpt-4o-mini",
            store: true,
            messages: [
              ...configModelOpenAIGenerateInsigths,
              {
                "role": "user",
                "content": `Genera el informe de ${ JSON.stringify( responseX ) } `
              }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "informes_response",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            informes:{
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        monto: { type: "string" },
                                        responsables: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            },
                                            additionalProperties: false
                                        },
                                        resumen: {
                                            type: "object",
                                            properties: {
                                                descripcion: { type: "string" },
                                                no_beneficiarios: { type: "string" },
                                                lugar: { type: "string" }
                                            },
                                            required: ["descripcion", "no_beneficiarios", "lugar"],
                                            additionalProperties: false
                                        },
                                    },
                                    required: ["monto", "responsables", "resumen"],
                                    additionalProperties: false,
                                }
                            }
                        },
                        required: ["informes"],
                        additionalProperties: false,
                    },

                }
            },
        });
    
        const response: ChatCompletion = await completion;
        const { model, created, choices } = response;

        // Check if the OpenAI safety system refused the request and generated a refusal instead
        if (choices[0].message.refusal) {
            // your code should handle this error case
            // In this case, the .content field will contain the explanation (if any) that the model generated for why it is refusing
            console.log( choices[0].message.refusal );
            res.json({
                msg: "algo salio mal, consulte con el administrador"
            });
        }

        const summaryJSON = choices[0].message.content;
        const summaryHTML = generateInformeHTML( JSON.parse( summaryJSON || '' )?.informes as Proyecto[] );
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(summaryHTML);
        const pdfBuffer = await page.pdf({ format: "A4" });
        await browser.close();
    
        // Enviar el PDF como respuesta
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=informe.pdf",
        });
      
        res.send(pdfBuffer);
        // fs.writeFileSync("informe.html", newSummaryJSON, "utf8"); // Guardar el HTML
        // await generatePDF(newSummaryJSON); // Convertir a PDF
        // console.log("Informe generado con éxito: informe.pdf");
        // res.status( 200 ).json({
        //     choices
        // });
    }catch( error ) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ 
            error2: "Error interno al generar el informe",
            error
        });
    }
}