import axios from "axios";
import config from "../config";

const BASE_URL = config.BACKEND_URL;

export const AxiosPost = async (api, body) => {
  try {
    const response = await axios.post(`${BASE_URL + api}`, body);
    return response;
  } catch (error) {
    throw error;
  }
};
