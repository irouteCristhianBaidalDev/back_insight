import puppeteer from "puppeteer";

export async function generatePDF(html: string ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: "informe.pdf", format: "A4" });
    await browser.close();
}