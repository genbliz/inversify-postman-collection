import {
  Collection,
  Item,
  Url,
  ItemGroup,
  RequestDefinition,
} from "postman-collection";

export interface IRouteDefData {
  [n: string]: Record<
    string,
    {
      request: any;
      response: any;
      describe?: string;
    }
  >;
}

export interface IInversifyRouteDefInput {
  controller: string;
  endpoints: {
    route: string;
    args?: string[];
  }[];
}

export interface IInversifyOutputCustom {
  group: string;
  endpoints: {
    title: string;
    method: string;
    url: string;
    queryParams?: string[];
    requestBody?: any;
    response?: any;
  }[];
}

function getRouteDefData({
  routeDefData,
  routeRawDefName,
  groupName,
  method,
  controller,
}: {
  routeDefData?: IRouteDefData;
  routeRawDefName: string | null;
  groupName: string;
  method: string;
  controller: string;
}) {
  let requestBody: any = undefined;
  let responseBody: any = undefined;
  let routeDescribe: string | null = null;
  if (routeDefData && routeRawDefName && groupName) {
    try {
      const _getDef = () => {
        /* Ensures flexibility in naming */
        const defKey1 = groupName.toLowerCase();
        const defKey2 = groupName[0].toLowerCase() + groupName.slice(1);
        const defKey3 = groupName[0].toUpperCase() + groupName.slice(1);
        //
        const defKey4 = controller.toLowerCase();
        const defKey5 = controller[0].toLowerCase() + controller.slice(1);
        const defKey6 = controller[0].toUpperCase() + controller.slice(1);
        //
        const def =
          routeDefData[defKey1] ||
          routeDefData[defKey2] ||
          routeDefData[defKey3] ||
          routeDefData[groupName] ||
          //
          routeDefData[defKey4] ||
          routeDefData[defKey5] ||
          routeDefData[defKey6] ||
          routeDefData[controller];

        if (def) {
          return def[routeRawDefName];
        }
        return null;
      };

      const _def = _getDef();
      const _method = method.toUpperCase();

      console.log({ _def });

      if (_def) {
        if (
          _def.request !== undefined &&
          (_method === "POST" || _method === "PUT")
        ) {
          requestBody = _def.request;
        }
        if (_def.response !== undefined) {
          responseBody = _def.response;
        }
        if (_def.describe) {
          routeDescribe = _def.describe;
        }
      }
    } catch (error) {
      requestBody = undefined;
      responseBody = undefined;
      routeDescribe = null;
      console.log(error);
    }
  }
  // console.log({ requestBody, responseBody, routeDescribe });
  return { requestBody, responseBody, routeDescribe };
}

function getValidQueryParams(args?: string[]) {
  const queryParamResult = (args || [])
    .map((arg) => {
      if (arg.startsWith("queryParam")) {
        const val = arg.split(" ")[1] || "";
        if (val && val !== "undefined") {
          return val.trim();
        }
      }
      return "";
    })
    .filter((x) => x);

  const defPrefix = "def__";
  const queryParams = queryParamResult.filter((x) => !x.startsWith(defPrefix));

  const queryParamDef = queryParamResult.filter((x) => x.startsWith(defPrefix));

  let routeName: string | null = null;
  let routeRawDefName: string | null = null;
  if (queryParamDef?.length) {
    routeRawDefName = queryParamDef[0];
    const _routeName = queryParamDef[0].split(defPrefix).slice(1).join("");
    routeName = _routeName
      .split("_")
      .filter((x) => x)
      .join(" ");
  }
  return { queryParams, routeName, routeRawDefName };
}

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
    const groupName = controller
      .split("Controller")[0]
      .replace(/([a-z](?=[A-Z]))/g, "$1 ");
    dataRoutesDef.group = groupName;
    dataRoutesDef.endpoints = [];
    endpoints.forEach(({ route, args }) => {
      //
      const methodRote = route.split(" ");
      const method:
        | "POST"
        | "PUT"
        | "GET" = methodRote[0].trim().toUpperCase() as any;
      let urlPath = methodRote[1].trim();
      if (urlPath.endsWith("/")) {
        urlPath = urlPath.slice(0, -1);
      }
      const url = [baseUrl, urlPath].filter((x) => x).join("");
      const { queryParams, routeName, routeRawDefName } = getValidQueryParams(
        args
      );

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
  const header = headerEnvVariables?.length
    ? headerEnvVariables.map(([key, value]) => ({ key, value }))
    : undefined;

  routesDefs.forEach(({ endpoints, controller }) => {
    const groupName = controller
      .split("Controller")[0]
      .replace(/([a-z](?=[A-Z]))/g, "$1 ");
    const groupItem = new ItemGroup<any>({
      name: groupName,
    });

    endpoints.forEach(({ route, args }) => {
      const methodRoute = route.split(" ");
      const method = methodRoute[0].trim().toUpperCase();
      let urlPath = methodRoute[1].trim();
      if (urlPath.endsWith("/")) {
        urlPath = urlPath.slice(0, -1);
      }
      let url = [baseUrl, urlPath].filter((x) => x).join("");

      const { queryParams, routeName, routeRawDefName } = getValidQueryParams(
        args
      );

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
        })
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
