import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const configModelOpenAIGenerateInsigths: ChatCompletionMessageParam[] = [
    {   
        "role": "user",
        "content": "Eres un asistente que crea informes detallados en formato JSON.",
    },
    {
        "role": "user",
        "content": "La información que vas a tomar en cuenta son oportunidades de inversión donde incluya el monto, responsables, descripción del proyecto, por ejemplo, un nuevo proyecto a implementar por la Empresa Eléctrica del Ecuador.",
    },
    // {
    //     "role": "user",
    //     "content": `La respuesta debe tener el siguiente formato, el formato se debe seguir estrictamente
    //     no debe haber cambio de nombres de propiedades,
    //     { informes es un array de objetos con la siguiente información
    //         {
    //             monto, responsables un array de string, resumen objeto con la siguiente estructura: {
    //                 descripcion, beneficiarios, lugar
    //             }
    //         }
    //     }`
    // },
];