import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { customHistory } from "../..";

const sleep = () => new Promise(resolve=> setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials=true;

const responseBody = (response:AxiosResponse)=>response.data;

axios.interceptors.response.use(async response=>{
    await sleep();
    return response
}, (error:AxiosError)=>{
    const {data, status} = error.response as any;
    switch (status) {
        case 400:
            if(data.errors)
            {
                const modelStateErrors: string[]=[];
                for(const key in data.errors)
                {
                    if(data.errors[key]) {
                        console.log("suresh6");
                        modelStateErrors.push(data.errors[key])
                    }
                }
                console.log("suresh5");
                throw modelStateErrors.flat();
            }
            console.log("suresh0");
            toast.error(data.title);
            break;
        case 401:
            console.log("suresh1");
            toast.error("Unauthorized");
            toast.error(data.title);
            break;
        case 404:
            console.log("suresh2");
            toast.error(data.title);
            break;
        case 500:
            customHistory.push({
                    pathname:'/server-error',
                    state:{error:data}
                });
            break;                 
        default:
            break;
    }
    console.log("Cought by interseptor")
    return Promise.reject(error.response);
})

const requests = {
    get:(url:string) => axios.get(url).then(responseBody),
    post:(url:string, body:{}) => axios.post(url, body).then(responseBody),
    put:(url:string, body:{}) => axios.put(url,body).then(responseBody),
    delete:(url:string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list:()=>requests.get('products'),
    details:(id:number)=>requests.get(`products/${id}`)
}

const testErrors = {
    get400Error: ()=>requests.get('buggy/bad-request'),
    get401Error: ()=>requests.get('buggy/unauthorized'),
    get404Error: ()=>requests.get('buggy/not-found'),
    get500Error: ()=>requests.get('buggy/server-error'),
    getValidationError: ()=>requests.get('buggy/validation-error'),
}

const Basket = {
    get:() => requests.get('basket'),
    addItem:(productId:number, quantity = 1)=>requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem:(productId:number, quantity = 1)=>requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    testErrors,
    Basket
}

export default agent;