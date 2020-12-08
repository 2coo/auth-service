import axios from "axios";
import { makeUseAxios } from "axios-hooks";
import { useAuthContext } from "../../store/auth/context";

const API_HOST = process.env.REACT_APP_API_HOST || "/";

axios.interceptors.request.use(function (config) {
  const { state } = useAuthContext();
  const token = state.accessToken;
  config.headers.Authorization = token;
  return config;
});

const useAxios = makeUseAxios({
  axios: axios.create({ baseURL: API_HOST }),
});

export { useAxios };
