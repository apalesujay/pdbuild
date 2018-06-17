
const getOptions = {
                     limit:{
                            maxValue:2},
                     skip:{                       //skip reserverd for future use
                            defaultvalue:0 }
                        
                    };

const postOptions = {
                     allowed:[],
                     notallowed:[]
                    }

const putOption = {};

const patchOption ={};

const deleteOption={};


module.exports = { getOptions,postOptions }