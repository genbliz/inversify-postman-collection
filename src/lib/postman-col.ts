import type { IInversifyRouteDefInput, IRouteDefData } from "../types";
import { Collection, Item, Url, ItemGroup, RequestDefinition } from "postman-collection";
import { getRouteDefData, getValidQueryParams } from "../helpers";

export function getPostmanCollection({
  routesDefs,
  title,
  baseUrl,
  headerEnvVariables,
  routeDefData,
}: {
  routesDefs: IInversifyRouteDefInput[];
  title: string;
  baseUrl: string;
  headerEnvVariables?: string[][];
  routeDefData?: IRouteDefData;
}) {
  const myCollection = new Collection({ name: title });
  myCollection.describe(`${title}`);
  const header = headerEnvVariables?.length ? headerEnvVariables.map(([key, value]) => ({ key, value })) : undefined;

  routesDefs.forEach(({ endpoints, controller }) => {
    const groupName = controller.split("Controller")[0].replace(/([a-z](?=[A-Z]))/g, "$1 ");
    const groupItem = new ItemGroup<any>({
      name: groupName,
    });

    endpoints.forEach(({ route, args }) => {
      let [method, urlPath] = route.split(" ").map((x) => x.trim());
      if (urlPath.endsWith("/")) {
        urlPath = urlPath.slice(0, -1);
      }
      let url = [baseUrl, urlPath].filter((x) => x).join("");

      const { queryParams, routeName, routeRawDefName } = getValidQueryParams(args);

      if (queryParams?.length) {
        const newUrl = new Url(url);
        queryParams.forEach((key) => {
          newUrl.addQueryParams(key);
        });
        url = newUrl.getRaw();
      }

      const { requestBody, responseBody, routeDescribe } = getRouteDefData({
        groupName,
        method,
        routeRawDefName,
        routeDefData,
        controller,
      });

      const requestDef: RequestDefinition = {
        url,
        method,
        header,
      };

      if (requestBody !== undefined) {
        requestDef.body = {
          mode: "raw",
          raw: JSON.stringify(requestBody, null, 2),
        };
      }

      if (responseBody !== undefined) {
        // ResponseDefinition
        // response: responseBody
        //   ? [
        //       {
        //         code: 200,
        //         body: responseBody,
        //       },
        //     ]
        //   : undefined,
      }

      groupItem.items.add(
        new Item({
          name: routeDescribe ?? routeName ?? url,
          request: requestDef,
          response: undefined,
        }),
      );
    });
    myCollection.items.add(groupItem);
  });

  const result = myCollection.toJSON();

  result.item = result?.item?.sort((a, b) => {
    const _a = (a.name || "").toLowerCase();
    const _b = (b.name || "").toLowerCase();

    if (_a > _b) {
      return 1;
    }
    if (_a < _b) {
      return -1;
    }
    return 0;
  });
  return result;
}
