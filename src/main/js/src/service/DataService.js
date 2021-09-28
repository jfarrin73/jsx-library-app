import axios from 'axios'

const ENTRIES = `entries/public`
const USER = `user`

const getToken = () => {
    if (localStorage.getItem("token") !== null) {
        return JSON.parse(localStorage.getItem("token"));
    }

    return "";
}

const getCurrentUser = () => {
    if (localStorage.getItem("username") !== null) {
        return JSON.parse(localStorage.getItem("username"));
    }

    return "";
}

class DataService {

    retrieveAllEntries(name) {
        return axios.get(ENTRIES);
    }

    retrieveEntry(id) {
        return axios.get(ENTRIES + `/${id}`);
    }

    deleteEntry(id) {
        return axios.delete(ENTRIES + `/${id}`);
    }

    updateEntry(entry) {
        return axios.put(ENTRIES + `/${entry.id}`, entry);
    }

    async createEntry(entry) {
        entry.createdBy = getCurrentUser();
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