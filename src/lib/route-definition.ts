import type { IInversifyRouteDefInput, IRouteDefData, IInversifyOutputCustom } from "../types";
import { getRouteDefData, getValidQueryParams } from "../helpers";

export function getRouteDefinitions({
  routesDefs,
  baseUrl,
  title,
  routeDefData,
}: {
  routesDefs: IInversifyRouteDefInput[];
  baseUrl: string;
  title: string;
  routeDefData?: IRouteDefData;
}) {
  const dataRoutesDefList: IInversifyOutputCustom[] = [];
  type IEndPoint = IInversifyOutputCustom["endpoints"][0];
  routesDefs.forEach(({ endpoints, controller }) => {
    const dataRoutesDef = {} as IInversifyOutputCustom;
    const groupName = controller.split("Controller")[0].replace(/([a-z](?=[A-Z]))/g, "$1 ");
    dataRoutesDef.group = groupName;
    dataRoutesDef.endpoints = [];
    endpoints.forEach(({ route, args }) => {
      //
      let [method01, urlPath] = route.split(" ").map((x) => x.trim());
      const method: "POST" | "PUT" | "GET" = method01.toUpperCase() as any;
      if (urlPath.endsWith("/")) {
        urlPath = urlPath.slice(0, -1);
      }
      const url = [baseUrl, urlPath].filter((x) => x).join("");
      const { queryParams, routeName, routeRawDefName } = getValidQueryParams(args);

      const endpoint = { url, method } as IEndPoint;

      if (queryParams?.length) {
        endpoint.queryParams = queryParams;
      }

      if (routeName) {
        endpoint.title = routeName;
      }

      const { requestBody, responseBody, routeDescribe } = getRouteDefData({
        groupName,
        method,
        routeRawDefName,
        routeDefData,
        controller,
      });

      if (requestBody !== undefined) {
        endpoint.requestBody = requestBody;
      }

      if (responseBody !== undefined) {
        endpoint.response = responseBody;
      }

      if (routeDescribe) {
        endpoint.title = routeDescribe;
      }

      dataRoutesDef.endpoints.push(endpoint);
    });
    dataRoutesDefList.push(dataRoutesDef);
  });

  const dataRoutesDefListSorted = dataRoutesDefList?.sort((a, b) => {
    const _a = (a.group || "").toLowerCase();
    const _b = (b.group || "").toLowerCase();

    if (_a > _b) {
      return 1;
    }
    if (_a < _b) {
      return -1;
    }
    return 0;
  });
  return dataRoutesDefListSorted;
}
