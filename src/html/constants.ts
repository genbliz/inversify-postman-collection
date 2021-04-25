export function getefinedStyles() {
  //
  const css = `


  html {
    box-sizing: border-box;
  }

  * {
    padding: 0;
    margin: 0;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Roboto', 'Lato', 'Segoe UI', 'sans-serif', Oxygen;
  }

  body {
    height: auto;
    max-width: 100%;
    margin-bottom: 100px;
    margin-left: 20px;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }


  table {
    width: 100%;
    position: relative;
    border-collapse: collapse;
    /* background-color: transparent; */
  }

  td,
  th {
    border: 1px solid #bdb9b9;
    padding: 0px;
    padding-left: 5px;
    padding-right: 5px;
    text-align: left;
  }

  td:first-of-type,
  th:first-of-type {
    padding-left: 8px;
  }

  td:last-of-type,
  th:last-of-type {
    padding-right: 8px;
  }

  th.left,
  td.left {
    text-align: left;
  }

  th.center,
  td.center {
    text-align: center;
  }

  td.numeric,
  td.number,
  td.right,
  th.number,
  th.right,
  th.numeric {
    text-align: right;
  }

  thead {
    white-space: nowrap;
  }

  thead tr {
    height_: 100%;
  }

  thead th {
    position: relative;
    vertical-align: bottom;
    text-overflow: ellipsis;
    line-height: 10px;
    letter-spacing: 0;
    color: rgba(0, 0, 0, 0.7);
    padding-bottom: 8px;
    box-sizing: border-box;
    /** font-size: 1em; */
    font-weight: bold;
  }

  tbody tr {
    position: relative;
    height: 25px;
    transition-duration: 0.9s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color;
  }

  tfoot {
    font-weight: 700;
    background-color: #bdb9b9;
  }

  h1,
  h2,
  h3 {
    margin-top: 5px;
    margin-bottom: 3px;
  }

  .root-content {
    width: 100%;
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
    min-height: 100%;
  }

  .root-content>h1 {
    margin-top: 20px;
    font-size: 30px;
    text-align: center;
    text-transform: uppercase;
    max-width: 900px;
  }

  .group {
    width: 100%;
    max-width: 900px;
    margin-top: 70px;
  }

  .group h1 {
    margin-top: 20px;
    font-size: 22px;
    text-align: center;
    text-transform: uppercase;
  }

  .endpoint {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  /* On mouse-over, add a deeper shadow */
  .endpoint:hover {
    box-shadow: 0 8px 10px 10px rgba(0, 0, 0, 0.2);
  }

  /* Add some padding inside the card container */
  .endpoint-container {
    padding: 10px 10px;
  }

  .endpoint-container td textarea {
    border: none;
    resize: none;
    outline: none;
    font-family: 'Courier New', Courier, monospace;
  }

  .endpoint h2 {
    font-size: 16px;
    text-align: center;
    padding: 5px;
    padding-top: 10px;
  }

  .code {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    padding: 10px;
  }



  `;
  return css;
}
