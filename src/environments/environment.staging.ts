const host = window.location.hostname;
const port = 3000;
let https = false;
let str = 'http://';
let web_host = host;

if (host === 'localhost') {
    https = false;
    str = 'http://';
    web_host = host + ':4200';
}

export const environment = {
    env: 'staging',
    production: false,
    staging: true,
    API_URL: 'https://hirecommit-api-staging.herokuapp.com/',
    captcha_site_key: '6Lem7ccUAAAAABRIlRSa6Nil1yC9m-uLVZTEdR3g',
    imageUrl: 'https://hirecommit-api-staging.herokuapp.com/upload/',
    employerURL: 'https://employer.tanubhasin.com/',
    candidateURL: 'https://candidate.tanubhasin.com/',
    mainURL: 'https://tanubhasin.com/'
};
