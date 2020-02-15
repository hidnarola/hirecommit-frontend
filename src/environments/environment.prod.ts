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
  env: 'prod',
  production: true,
  staging: false,
  API_URL: 'https://hirecommit-api.herokuapp.com/',
  captcha_site_key: '6Lem7ccUAAAAABRIlRSa6Nil1yC9m-uLVZTEdR3g',
  imageUrl: 'https://hirecommit-api.herokuapp.com/candidate_image?key=',
  employerURL: 'https://employer.hirecommit.com/',
  candidateURL: 'https://candidate.hirecommit.com/',
  mainURL: 'https://www.hirecommit.com/'
};
