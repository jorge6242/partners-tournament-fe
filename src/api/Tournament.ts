import AXIOS from "../config/Axios";
import headers from "../helpers/headers";
import Prefix from "../config/ApiPrefix";

const API = {
  getAll(data: number, perPage: number) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/tournament`, {
      params: {
        page,
        perPage,
      },
      headers: headers(),
    });
  },
  getList() {
    return AXIOS.get(`${Prefix.api}/tournament-list`, { headers: headers() });
  },
  getByCategory(id: any) {
    return AXIOS.get(`${Prefix.api}/tournament-by-category`, {
      params: { id },
      headers: headers(),
    });
  },
  getAvailableTournamentsByCategory(id: any) {
    return AXIOS.get(`${Prefix.api}/available-tournaments-by-category`, {
      params: { id },
      headers: headers(),
    });
  },
  getAvailableTournament(id: any) {
    return AXIOS.get(`${Prefix.api}/tournament-available`, {
      params: { id },
      headers: headers(),
    });
  },
  getAvailableQuota(id: any) {
    return AXIOS.get(`${Prefix.api}/tournament-available-quota`, {
      params: { id },
      headers: headers(),
    });
  },
  getAvailablePlayerTournament(id: any) {
    return AXIOS.get(`${Prefix.api}/tournament-player-available`, {
      params: { id },
      headers: headers(),
    });
  },
  getInscriptions(data: number, perPage: number, query: object) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/tournament-inscriptions`, {
      params: {
        page,
        perPage,
        ...query,
      },
      headers: headers(),
    });
  },
  getInscriptionsByParticipant(data: number, perPage: number, query: object) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/tournament-inscriptions-participant`, {
      params: {
        page,
        perPage,
        ...query,
      },
      headers: headers(),
    });
  },
  getInscriptionsReport(data: number, perPage: number, query: object) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/tournament-inscriptions-report`, {
      params: {
        page,
        perPage,
        ...query,
      },
      headers: headers(),
    });
  },
  create(data: any) {
    return AXIOS.post(
      `${Prefix.api}/tournament`,
      {
        ...data,
      },
      { headers: headers() }
    );
  },
  createParticipant(data: any) {
    return AXIOS.post(
      `${Prefix.api}/tournament-participant`,
      {
        ...data,
      },
      { headers: headers() }
    );
  },
  getParticipant(id: number) {
    return AXIOS.get(`${Prefix.api}/tournament-participant-get`, {
      params: { id },
      headers: headers(),
    });
  },
  get(id: number) {
    return AXIOS.get(`${Prefix.api}/tournament/${id}`, { headers: headers() });
  },
  update(data: any) {
    return AXIOS.put(
      `${Prefix.api}/tournament/${data.id}`,
      {
        ...data,
      },
      { headers: headers() }
    );
  },
    updateParticipant(body: object) {
    return AXIOS.put(
      `${Prefix.api}/tournament-participant-update`,
      {
        ...body,
      },
      { headers: headers() }
    );
  },
  remove(id: number) {
    return AXIOS.delete(`${Prefix.api}/tournament/${id}`, {
      headers: headers(),
    });
  },
  search(term: string, perPage: number) {
    return AXIOS.get(`${Prefix.api}/tournament-search`, {
      params: {
        term,
        perPage,
      },
      headers: headers(),
    });
  },
};

export default API;
