import type { IInversifyOutputCustom } from "../types/type";
import { getefinedStyles } from "./constants";
import { convertGroup } from "./group";

export function convertRouteDefinitionToHtml({
  routeDefs,
  apiTitle = "Max Api Definitions",
}: {
  routeDefs: IInversifyOutputCustom[];
  apiTitle?: string;
}) {
  const styles = getefinedStyles();
  const rootContents = routeDefs.map((group) => convertGroup(group));
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Lato&display=swap" />
      <style>${styles}</style>
      <title>${apiTitle}</title>
    </head>
    <body>
      <div class="root-content">
      ${rootContents.join("\n")}
      </div>
    </body>
  </html>
  `;
  return html;
}
