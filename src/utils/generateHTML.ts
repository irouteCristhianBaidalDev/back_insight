import { Proyecto } from "../models/response.api.openai";
import stylesPlantilla from '../config/const/styles_plantilla_informe'

export const generateInformeHTML = ( proyectos: Proyecto[]): string => {
    let proyectosHTML = "";
    
    proyectos.forEach( ({
        monto,
        responsables,
        resumen,
    }, index ) => {
        const { descripcion, beneficiarios, lugar } = resumen;
        proyectosHTML +=`<div class="informe-container">
            <div class="informe-header">
                <h3>Informe</h3>
            </div>

            <div class="proyecto-titulo"> Proyecto #${ index + 1 }</div>

            <div class="monto">
                <b>Monto:</b> <span>${ monto }</span>
            </div>
            
            <div class="responsables">
                <h4>Responsables:</h4>
                <ul>
                    ${ responsables.map( r => '<li>'+ r +'</li>').join("")}
                </ul>
            </div>

            <div class="resumen">
                <h4>Resumen</h4>
                <p><b>Beneficiarios:</b>${ beneficiarios }</p>
                <p><b>Descripción:</b>${ descripcion }</p>
                <p class="lugar"><b>Lugar:</b> ${ lugar }</p>
            </div>
        </div>`
    } );
    return `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Plantilla</title>
            </head>
            ${ stylesPlantilla }
        <body>
            ${ proyectosHTML }
        </body>
    </html>`;
}