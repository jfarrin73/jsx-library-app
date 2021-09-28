import axios from 'axios'

// axios.defaults.baseURL = "http://localhost:8081";
// const BASE_URL = "http://localhost:8081/";

const ENTRIES = `entries/public`
const USER = `user`

const getToken = () => {
    if (localStorage.getItem("token") !== null) {
        let token = JSON.parse(localStorage.getItem("token"));
        console.log("token: " + token)
        return token;
    }

    return "";
}

class DataService {

    retrieveAllEntries(name) {
        //console.log('executed service')
        return axios.get(ENTRIES);
    }

    retrieveEntry(id) {
        //console.log('executed service')
        return axios.get(ENTRIES + `/${id}`);
    }

    deleteEntry(id) {
        //console.log('executed service')
        return axios.delete(ENTRIES + `/${id}`);
    }

    updateEntry(entry) {
        //console.log('executed service')
        return axios.put(ENTRIES + `/${entry.id}`, entry);
    }

    async createEntry(entry) {
        return await axios.post(ENTRIES + `/create`, entry, {headers: {Authorization: `Bearer ${getToken()}`}});
    }

    async login(user) {
        return await axios.post(USER + `/login`, user);
    }

    async register(user) {
        return await axios.post(USER + `/register`, user);
    }
}

export default new DataService()