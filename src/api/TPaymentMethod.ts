import AXIOS from "../config/Axios";
import headers from "../helpers/headers";
import Prefix from "../config/ApiPrefix"; // ruta baseURL de el backend

//Rutas del frontend

const API = {
  getAll(data: number, perPage: number) {// cada function esta tipada
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/tpayment-method`, { // cada ruta tiene su verbo
      params: {
        page,
        perPage
      },
      headers: headers() // en esta function se invocan los headers para el consumo del enpoint como el token
    });
  },
  getList() {
    return AXIOS.get(`${Prefix.api}/tpayment-method-list`, { headers: headers() });
  },
  create(data: any) {
    return AXIOS.post(
      `${Prefix.api}/tpayment-method`,
      {
        ...data
      },
      { headers: headers() }
    );
  },
  get(id: number) {
    return AXIOS.get(`${Prefix.api}/tpayment-method/${id}`, { headers: headers() });
  },
  update(data: any) {
    return AXIOS.put(
      `${Prefix.api}/tpayment-method/${data.id}`,
      {
        ...data
      },
      { headers: headers() }
    );
  },
  remove(id: number) {
    return AXIOS.delete(`${Prefix.api}/tpayment-method/${id}`, { headers: headers() });
  },
  search(term: string, perPage: number) {
    return AXIOS.get(`${Prefix.api}/tpayment-method-search`, {
      params: {
        term,
        perPage
      },
      headers: headers()
    });
  }
};

export default API;
