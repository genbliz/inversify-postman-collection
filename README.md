convert inversify route to postman collection

## Install

`npm install --save inversify-postman-collection`

or

`yarn add inversify-postman-collection`


## Usage

```typescript
// controllers/auth.ts

@controller('/v1/auth')
export class AuthController {

  @httpPost('/login')
  async Login(@queryParam('def__Login') def: string, req: express.Request, res: express.Response) {
    try {
      const data req.body;
      const result = await AuthService.login(data);

      return this.success({ res, data: result });
    } catch (error) {
      return this.error({ res, error });
    }
  }

  @httpPost('/register')
  async Register(@queryParam('def__Register') def: string, req: express.Request, res: express.Response) {
    try {
      const data req.body;
      const result = await AuthService.register(data);

      return this.success({ res, data: result });
    } catch (error) {
      return this.error({ res, error });
    }
  }
}
```

```typescript
// app/route-def/index.ts

const Auth = {
  def__Register: {
    request: {
      name: '',
      password: '',
      email: '',
    },
    response: { name: '', email: '' },
  },
  def__Login: {
    request: {
      password: '',
      email: '',
    },
    response: { access_code: '' },
  },
};

export const routeDefinitionData = { Auth /* this will map to AuthController */ }
```

```typescript
// controllers/xyz.ts

import container from '../config/inversify.config';
import { getRouteInfo, httpGet } from 'inversify-express-utils';
import { getPostmanCollection, getRouteDefinitions } from 'inversify-postman-collection';
import { routeDefinitionData } from 'app/route-def';

@httpGet('/postman')
postmanRoute(req: Request, res: Response) {
  const routeInfo = getRouteInfo(container);
  const headerEnvVariables = [['Authorization', '{{my-auth-access-header}}']];
  const result = getPostmanCollection({
    routesDefs: routeInfo, // required
    title: 'My Api Collection Title', // required
    baseUrl: '{{my-api-base-url}}', // required
    headerEnvVariables: headerEnvVariables, // optional
    routeDefData: routeDefinitionData  // optional
  });
  res.status(200).send(result);
}

```
