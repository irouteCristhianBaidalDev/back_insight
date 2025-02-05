import { Request, Response } from "express";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
// import { responseX } from '../data/x_response'
import { responseX } from '../data/x_response_celec';
import fs from "fs";
import { generatePDF } from "../utils/generatePDF";
import puppeteer from "puppeteer";


const BEARER_TOKEN_TWITTER = "";
const BEARER_TOKEN_OPENAI = "";

const BASE_URL_TWITTER = "https://api.twitter.com/2";
// from:Cnel_EP inversiones proyectos inversion monto responsable mantenimiento
const BASE_URL_OPENAI = "";


// X - INTERFACES
interface Tweet{
    id: string,
    edit_history_tweet_ids: string[],
    text: string
}

interface Meta{
    newest_id: string,
    oldest_id: string,
    result_count: number
}

interface ResponseX {
    data: Tweet[],
    meta: Meta
}

// OBTENER POST DE TWITTER
export const getPost = async ( req: Request, res: Response) => {
    const query = req.query.query as string;
    let response: ResponseX = {
        data : [],
        meta: {
            newest_id: "",
            oldest_id: "",
            result_count: 0
        }
    };
    if( !query ){
        res.status( 400 ).json({
            msg: "Debe enviar al menos un query"
        })
    }

    if( query !== undefined && query.trim().length === 0){
        res.status( 400 ).json({
            msg: "Debe enviar al menos un query"
        })
    }

    await fetch(
        `${ BASE_URL_TWITTER}/tweets/search/recent?query=${ query.trim() }`,
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
export const getInsights = async( req: Request, res: Response ) => {
    
    // const query = req.query.query as string;

    // if( !query ){
    //     res.status( 400 ).json({
    //         msg: "Debe enviar al menos un query"
    //     })
    // }

    // if( query !== undefined && query.trim().length === 0){
    //     res.status( 400 ).json({
    //         msg: "Debe enviar al menos un query"
    //     })
    // }
    try{
        const openai = new OpenAI({
            apiKey: BEARER_TOKEN_OPENAI,
        });
    
        const completion = openai.chat.completions.create({
            // model: "gpt-4o",
            model: "gpt-4o-mini",
            store: true,
            messages: [
              {
                "role": "user",
                "content": "Eres un asistente que crea informes detallados en HTML.",
              },
              {
                "role": "user",
                "content": 
                    `Generame un informe de monto,
                    responsable y resumen de proyecto de inversion en base al siguiente
                    JSON ${ JSON.stringify( responseX.map( r => `${ r.text }`).join("\n") ) } `
              }
            ],
        });
    
        const response: ChatCompletion = await completion;
        const { model, created, choices } = response;
        const summaryHTML = choices[0].message.content as string;
        const initSplice: number = summaryHTML.indexOf("```html")
        const endSplice: number = summaryHTML.lastIndexOf("```");
        const newSummary = summaryHTML.substring( initSplice + 7, endSplice - 1 );
        
        // res.json({ newSummary });
        // return
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.setContent(summaryHTML);
        // const pdfBuffer = await page.pdf({ format: "A4" });
        // await browser.close();
    
        // // Enviar el PDF como respuesta
        // res.set({
        //     "Content-Type": "application/pdf",
        //     "Content-Disposition": "attachment; filename=informe.pdf",
        // });
      
        // res.send(pdfBuffer);
        fs.writeFileSync("informe.html", newSummary, "utf8"); // Guardar el HTML
        await generatePDF(newSummary); // Convertir a PDF
        console.log("✅ Informe generado con éxito: informe.pdf");
        res.status( 200 ).json({
            choices
        });
    }catch( error ) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ error: "Error interno al generar el PDF" });
    }
}