import { IRouteDefData } from "../types";

export function getRouteDefData({
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
        const defKey7 = groupName.toUpperCase();
        const defKey8 = controller.toUpperCase();
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
          routeDefData[controller] ||
          //
          routeDefData[defKey7] ||
          routeDefData[defKey8];

        if (def) {
          return def[routeRawDefName];
        }
        return null;
      };

      const def01 = _getDef();
      const method01 = method.toUpperCase();

      // console.log({ _def });

      if (def01) {
        if (def01.request !== undefined && (method01 === "POST" || method01 === "PUT")) {
          requestBody = def01.request;
        }
        if (def01.response !== undefined) {
          responseBody = def01.response;
        }
        if (def01.describe) {
          routeDescribe = def01.describe;
        }
      }
    } catch (error) {
      requestBody = undefined;
      responseBody = undefined;
      routeDescribe = null;
      // console.log(error);
    }
  }
  // console.log({ requestBody, responseBody, routeDescribe });
  return { requestBody, responseBody, routeDescribe };
}

export function getValidQueryParams(args?: string[]) {
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
