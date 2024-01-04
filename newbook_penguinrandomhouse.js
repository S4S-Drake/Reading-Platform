const axios = require('./Reading-Platform/infra/node_modules/axios');

const apiUrl = 'https://reststop.randomhouse.com/resources/titles?keyword=Grisham%20Christmas';
const username = 'readingplatformapp';
const password = '7hcmyf2n3rpj8rn8kf9hrcm3';

axios.get(apiUrl, {
    auth: {
        username: username,
        password: password
    },
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
