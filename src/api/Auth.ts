import AXIOS from "../config/Axios";
import Prefix from "../config/ApiPrefix"
import headers from "../helpers/headers";

const Auth = {
  login(data: object) {
    return AXIOS.post(`${Prefix.api}/auth/login`, {
      ...data
    });
  },
  checkLogin() {
    return AXIOS.get(`${Prefix.api}/check-login`, { headers: headers() });
  },
  forcedLogin(docId:any, token: any) {
    return AXIOS.get('/forced-login', {
      params: {
        docId,
        token
      },
      headers: headers() 
    });
  }
};

export default Auth;