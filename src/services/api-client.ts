// * creating a new access client with a custom configuration 

import axios, { CanceledError, AxiosError }  from "axios";

export default axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/'
})

export { CanceledError , AxiosError }