import { IInversifyOutputCustom } from "../types";

function convertEndPoint(endPoint: IInversifyOutputCustom["endpoints"][0]) {
  let queryParams01 = "";
  let requestBody01 = "";
  let response01 = "";

  if (endPoint?.queryParams?.length) {
    const query = endPoint.queryParams.map((f) => {
      return `<div>${f}</div>`;
    });
    queryParams01 = `
    <tr>
      <td>query</td>
      <td class="code">
        ${query.join("\n")}
      </td>
    </tr>
    `;
  }

  if (endPoint.requestBody) {
    requestBody01 = `
    <tr>
      <td>request</td>
      <td style="padding: 0px; margin: 0px">
        <textarea readonly rows="10" style="width: 100%">
${JSON.stringify(endPoint.requestBody, null, 2)}
        </textarea>
      </td>
    </tr>
    `;
  }

  if (endPoint.response) {
    response01 = `
    <tr>
      <td>response</td>
      <td style="padding: 0px; margin: 0px">
        <textarea readonly rows="10" style="width: 100%">
${JSON.stringify(endPoint.response, null, 2)}
        </textarea>
      </td>
    </tr>
    `;
  }

  const content = `
  <div class="endpoint">
  <h2>${endPoint.title}</h2>
  <div class="endpoint-container">
    <table>
      <body>
        <tr>
          <td>url</td>
          <td class="code">${endPoint.url}</td>
        </tr>
        <tr>
          <td>method</td>
          <td class="code">${endPoint.method.toUpperCase()}</td>
        </tr>

        ${queryParams01}

        ${requestBody01}

        ${response01}

      </body>
    </table>
  </div>
</div>
  `;
  return content;
}

export function convertGroup(group: IInversifyOutputCustom) {
  const endpoints01 = group.endpoints.map((f) => convertEndPoint(f));
  return `
<div class="group">
  <h1>${group.group}</h1>
  ${endpoints01.join("\n")}
</div>
  `;
}
