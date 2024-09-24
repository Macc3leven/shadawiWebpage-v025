const assetUrl = `https://dawi-asset-api-725ca903b96f.herokuapp.com/`;
const ipfsGateway = "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
import { saveData, getData } from "./storage";

async function specimenQuery(bodyReq={}){
    const page = bodyReq.page || 1;
    const limit = bodyReq.limit || 50;
    const search = bodyReq.search ? `&search=${bodyReq.search}`: "";
    const skill = bodyReq.skill ? `&skill=${bodyReq.skill}`: "";
    const className = bodyReq.class ? `&class=${bodyReq.class}`: "";
    const context = `specimen/all/?page=${page}&limit=${limit}${search}${skill}${className}`;
    const allSpecimenUrl = assetUrl + context;
    console.log(context)
    
    const cached = getData(context);
    if (cached) {
        console.log(context, ": Has been cached!");
        return cached;
    }

    const response = await fetch(allSpecimenUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
    } 

    const results = await response.json();
    return results;
} 

async function tokenQuery(bodyReq={}){

} 

async function playerQuery(bodyReq={}){

}

