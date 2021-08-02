import axios from 'axios';
import { retrieveData, deleteData, clearStorage } from './Helper';
import { Actions } from 'react-native-router-flux';

let baseUrl = 'https://ranting.twisdev.com/index.php/rest/items/search/api_key/teampsisthebest/';

export async function postData(payload) {

    let auth = '';
    const axiosConfig = {
        headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': 'Authorization',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: auth,
        },
    };

    return axios
        .post(baseUrl, payload, axiosConfig)
        .then(
            (response) => response,
            (error) => {
                console.log(error)
                return Promise.reject(error.response);
            },
        )
        .then((res) => {
            const dataReturn = {
                data: res.data,
                status: res.status,
            };
            return dataReturn;
        })

        .catch((err) => {
            return err;
        });
}

