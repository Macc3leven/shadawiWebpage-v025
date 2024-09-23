async function specimenQuery(bodyReq={}){
    const context = `specimen/all/` + parseQueries(queries);
    const allSpecimenUrl = assetUri + context;
    console.log(context);
    
    
    const cached = cache[context];
    if (cached) {
        console.log(context, ": Has been cached!");
        return cached;
    }

    const response = await fetch(allSpecimenUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    } 

    const results = await response.json();
    cache[context] = results;
    cache[context].ok = true;
    cache[context].timestamp = Date.now();
    console.log({ cache, data: results.data });

    return results;
} 

async function tokenQuery(bodyReq={}){

} 

async function playerQuery(bodyReq={}){

}