import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const tempSheetsMetadata = [
  {
    _id: 123,
    metadata: {
      name: "Array Problems",
      description: "Easy and medium array problems.",
    },
    data: {
      categories: [
        { name: "Medium", color: "bg-yellow-600" },
        { name: "easy", color: "bg-green-600" },
      ],
      totalProblems: 50,
      solvedProblems: 20,
      problems: [
        { id: 1, title: "Two Sum", difficulty: "Easy" },
        { id: 2, title: "Maximum Subarray", difficulty: "Medium" },
      ],
    },
  },
  {
    _id: 234,
    metadata: {
      name: "Graph Problems",
      description: "Problems related to graphs and trees.",
    },
    data: {
      categories: [
        { name: "Medium", color: "bg-yellow-600" },
        { name: "Hard", color: "bg-red-600" },
      ],
      totalProblems: 40,
      solvedProblems: 15,
      problems: [
        { id: 3, title: "Number of Islands", difficulty: "Medium" },
        { id: 4, title: "Word Ladder", difficulty: "Hard" },
      ],
    },
  },
];

export const jsonToQueryParamStringConvertor = (queryParams) => {
  if (!queryParams || typeof queryParams !== "object") {
    return "";
  }

  const queryString = Object.keys(queryParams)
    .map((key) => {
      const value = queryParams[key];

      if (value == null) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter((param) => param !== "")
    .join("&");

  return queryString ? `?${queryString}` : "";
};

export const getCookieValue = (cookieName) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const cookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
  return cookie ? cookie.split("=")[1] : null;
};

export const removeCookieKey = (cookieKey) => {
  document.cookie = `${cookieKey}=; Max-Age=-1; path=/`;
};
