declare module 'axios/lib/adapters/http' {
  import { AxiosAdapter } from 'axios';

  const HttpAdapter: AxiosAdapter;

  export default HttpAdapter;
}

declare module 'axios/lib/adapters/xhr' {
  import { AxiosAdapter } from 'axios';

  const XhrAdapter: AxiosAdapter;

  export default XhrAdapter;
}

declare module 'axios/lib/core/settle' {
  import { AxiosResponse } from 'axios';

  export default function(resolve: any, reject: any, response: any): AxiosResponse;
}

declare module 'axios/lib/core/createError' {
  import { AxiosError } from 'axios';

  export default function(message: any, config: any, code: any, request: any, response?: any): AxiosError;
}

declare module 'axios/lib/helpers/buildURL' {
  export default function(url: any, params: any, paramsSerializer: any): string;
}

declare module 'axios/lib/core/buildFullPath' {
  export default function(baseURL: any, requestedURL: any): string;
}

declare module 'axios/lib/utils' {
  export function isUndefined(val: any): boolean;
}
