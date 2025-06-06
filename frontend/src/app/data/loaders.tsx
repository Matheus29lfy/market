// import qs from "qs";
import { getAuthToken } from "../data/services/get-token";

import { flattenAttributes, getURL } from "../../lib/utils";

const baseUrl = getURL();

async function fetchData(url: string) {
  // const authToken = await getAuthToken();
  const authToken = '';

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${authToken}`,
      Authorization: `Bearer`,
    },
  };

  try {
    // const response = await fetch(url, authToken ? headers : {});
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // or return null;
  }
}

export async function getHomePageData() {
  
  const url = new URL("/products-to-show", baseUrl);
  return await fetchData(url.href);
}

// export async function getGlobalPageData() {

//   const url = new URL("/api/global", baseUrl);

//   url.search = qs.stringify({
//     populate: [
//       "header.logoText",
//       "header.ctaButton",
//       "footer.logoText",
//       "footer.socialLink",
//     ],
//   })

//   return await fetchData(url.href);

// }

// export async function getGlobalPageMetadata() {
//   const url = new URL("/api/global", baseUrl);

//   url.search = qs.stringify({
//     fields: ["title", "description"]
//   })

//   return await fetchData(url.href);
// }


// export async function getSummaries(queryString: string, currentPage: number) {
//   const PAGE_SIZE = 4;


//   const query = qs.stringify({
//     sort: ["createdAt:desc"],
//     filters: {
//       $or: [
//         { title: { $containsi: queryString } },
//         { summary: { $containsi: queryString } },
//       ],
//     },
//     pagination: {
//       pageSize: PAGE_SIZE,
//       page: currentPage,
//     },
//   });

//   const url = new URL("/api/summaries", baseUrl);
//   url.search = query;

//   return fetchData(url.href);
// }

// export async function getSummaryById(summaryId: string) {
//   return fetchData(`${baseUrl}/api/summaries/${summaryId}`);
// }