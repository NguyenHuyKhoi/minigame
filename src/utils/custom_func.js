 //arr type : [{key:"",value:""},...] => filter values arr from its 
const parseValues=(arr)=>{
    if (arr!==undefined && arr!==null) return Object.values(arr);
    return null;
}


const length=(arr)=>{
    if (!Array.isArray(arr))  return 0;
    return arr.length;
}
export {parseValues,length}

