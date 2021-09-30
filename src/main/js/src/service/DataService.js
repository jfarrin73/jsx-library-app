import axios from 'axios'

const ENTRIES = `entries/public`
const USER = `user`

const USERNAME = "username";
const TOKEN = "token";
const EMPTY = "";

const getToken = () => {
    if (localStorage.getItem(TOKEN) !== null) {
        return JSON.parse(localStorage.getItem(TOKEN));
    }

    return "";
}

// const getCurrentUser = () => {
//     if (localStorage.getItem(USERNAME) !== null) {
//         console.log(JSON.parse(localStorage.getItem(USERNAME)));
//         return JSON.parse(localStorage.getItem(USERNAME));
//     }
//
//     return "";
// }

class DataService {

    retrieveAllEntries(category, byUsername) {
        if (byUsername){
            return axios.get(ENTRIES + `/user`, {headers: {Authorization: `Bearer ${getToken()}`}});
        }

        return axios.get(ENTRIES + `?category=${category}`);
    }

    retrieveEntry(id) {
        return axios.get(ENTRIES + `/${id}`);
    }

    deleteEntry(id) {
        return axios.delete(ENTRIES + `/${id}`, {headers: {Authorization: `Bearer ${getToken()}`}});
    }

    updateEntry(entry) {
        console.log(entry.id);
        return axios.patch(ENTRIES + `/find/${entry.id}`, entry, {headers: {Authorization: `Bearer ${getToken()}`}});
    }

    async createEntry(entry) {
        // entry.createdBy = this.currentUser;
        return await axios.post(ENTRIES + `/create`, entry, {headers: {Authorization: `Bearer ${getToken()}`}});
    }

    async getCurrentUserName(){
        return await axios.get(USER + `/current`,{headers: {Authorization: `Bearer ${getToken()}`}})
    }

    async login(user) {
        return await axios.post(USER + `/login`, user);
    }

    async register(user) {
        return await axios.post(USER + `/register`, user);
    }

    ClearStorage(){
        if (localStorage.getItem(TOKEN) !== null) {
            localStorage.setItem(TOKEN, EMPTY);
            return localStorage.removeItem(TOKEN);
        }
        if (localStorage.getItem(USERNAME) !== null) {
            localStorage.setItem(USERNAME, EMPTY);
            return localStorage.removeItem(USERNAME);
        }
    }
}

export default new DataService()