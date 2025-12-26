import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"
import { splitDocument } from "./text_splitters";

export const websiteLoader = async (link : string)=>{
    const loader = new PuppeteerWebBaseLoader(link,{
        launchOptions: {
          headless: true,
        },
        gotoOptions: {
          waitUntil: "domcontentloaded",
        },
        evaluate : async (page)=>{
            return await page.evaluate(()=>{
                //@ts-ignore
                return document.body.innerText;
            })
        }
    });
    const logs = await loader.load();
    const split = await splitDocument(logs);
    return split;
};

