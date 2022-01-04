function hello(who) {
    return 'Привет' + who
}

let privet = hello('Vasa');


let name = (who) => 'Привет' + who;

import axios from "axios";

let getData = (ph) => axios.get(ph)

let getDataMain = (url, apiCRUD) => axios.get(url, apiCRUD)

export const usePrivet = {
    privet,
    name,
    getData,
    getDataMain
}
