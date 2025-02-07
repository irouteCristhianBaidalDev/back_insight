export const generateQueryGetTweets = ( cuentas: string[], keywords: string[]) : string => {
    //* from:CELECEPOficial (nueva OR obra OR proyecto OR inversión OR licitación)
    const groupByKeywords = keywords.map( 
        k => `${ k }`
    ).join(' OR ');

    const groupByUsers = cuentas.map(
        u => `from:${u}`
    ).join(" OR ");
    let query = `${groupByUsers} (${ groupByKeywords })`;
    return query;
}