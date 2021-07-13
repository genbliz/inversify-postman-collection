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
    response?: any | Record<string, any> | Record<string, any>[];
  }[];
}
