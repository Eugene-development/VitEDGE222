function hello(who) {
    return 'Привет' + who
}

let privet = hello('Vasa');


let name = (who) => 'Привет' + who;

import axios from "axios";

let getData = (ph) => axios.get(ph)

let getDataMain = (url, apiCRUD) => axios.get(url, apiCRUD)
// let getDataMain = (url, apiCRUD) => fetch('/api/my-endpoint').json()

// let getDataMain = () =>  fetch( APISettings.baseURL + '/brew-methods', {
//     method: 'GET',
// } )
//     .then( function( response ){
//
//             return response.json();
//
//     });

export const usePrivet = {
    privet,
    name,
    getData,
    getDataMain
}
