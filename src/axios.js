import axios from "axios";
axios.defaults.baseURL = process.env.VUE_APP_API_URL + process.env.VUE_APP_API_PREFIX;

//Interceptors
axios.interceptors.request.use(function (request) {
    request.headers['Content-Type'] = 'application/json';
    request.headers['Access-api'] = 'TaskLineUp';
    request.headers['x-creative-auth-token'] = localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserToken');
    return request;
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 500) {
        //console.log(error.response)
        window.location.href = '/?error=500';
    } else if (error.response.status === 401) {
        window.location.href = '/?error=401';
    } else {
        return Promise.reject(error);
    }
});
export default axios;