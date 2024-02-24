// * creating a new axios clieint with a custom configuration 

import axios, { CanceledError, AxiosError }  from "axios";

export default axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/'
})

export { CanceledError , AxiosError }