import axios from "axios";
import config from "../config";
import { jsonToQueryParamStringConvertor, removeCookieKey } from "@/lib/utils";
import { constants } from "./constants";

const BASE_URL = config.BACKEND_URL;

// navigation logic is handled in HOME page
const redirectToLoginPage = () => {
  removeCookieKey(constants.COOKIES_KEY.AUTH_TOKEN);
};

export const AxiosPost = async (api, body, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(`${BASE_URL + api}`, body, { headers });
    return response;
  } catch (error) {
    // Handle expired token
    if (error.response && error.response.status === 401) {
      redirectToLoginPage();
    }
    throw error; // Re-throw error for other cases
  }
};

export const AxiosGet = async (api, queryParams, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const queryStringParams = jsonToQueryParamStringConvertor(queryParams);
    const response = await axios.get(`${BASE_URL + api + queryStringParams}`, {
      headers,
    });
    return response;
  } catch (error) {
    // Handle expired token
    if (error.response && error.response.status === 401) {
      redirectToLoginPage();
    }
    throw error; // Re-throw error for other cases
  }
};

export const AxiosDelete = async (api, queryParams, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const queryStringParams = queryParams
      ? jsonToQueryParamStringConvertor(queryParams)
      : "";
    console.log("Query: ", queryParams);
    const response = await axios.delete(
      `${BASE_URL + api + queryStringParams}`,
      { headers }
    );

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      redirectToLoginPage();
    }
    throw error;
  }
};
