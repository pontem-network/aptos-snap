import settle from 'axios/lib/core/settle';
import createError from 'axios/lib/core/createError';
import buildURL from 'axios/lib/helpers/buildURL';
import buildFullPath from 'axios/lib/core/buildFullPath';
import { isUndefined } from 'axios/lib/utils';

import { AxiosResponse, AxiosResponseHeaders, AxiosRequestConfig } from 'axios';

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
export default async function fetchAdapter(config: any): Promise<any> {
  const request = createRequest(config);
  const promiseChain = [getResponse(request, config)];

  if (config.timeout && config.timeout > 0) {
    promiseChain.push(
      new Promise((res) => {
        setTimeout(() => {
          const message = config.timeoutErrorMessage
            ? config.timeoutErrorMessage
            : 'timeout of ' + config.timeout + 'ms exceeded';
          res(createError(message, config, 'ECONNABORTED', request));
        }, config.timeout);
      })
    );
  }

  const data = await Promise.race(promiseChain);
  return new Promise((resolve, reject) => {
    if (data instanceof Error) {
      reject(data);
    } else {
      Object.prototype.toString.call(config.settle) === '[object Function]'
        ? config.settle(resolve, reject, data)
        : settle(resolve, reject, data);
    }
  });
}


/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
async function getResponse(request: { url: string, options: any }, config: any) {
  let stageOne;
  try {
    stageOne = await fetch(request.url, request.options);
  } catch (e) {
    return createError('Network Error', config, null, request);
  }

  const headers: AxiosResponseHeaders = {};

  stageOne.headers.forEach((v, k) => headers[k] = v);

  const response: Partial<AxiosResponse> = {
    config: config,
    headers,
    request,
    status: stageOne.status,
    statusText: stageOne.statusText,
  };

  if (stageOne.status >= 200 && stageOne.status !== 204) {
    switch (config.responseType) {
      case 'arraybuffer':
        response.data = await stageOne.arrayBuffer();
        break;
      case 'blob':
        response.data = await stageOne.blob();
        break;
      case 'json':
        response.data = await stageOne.json();
        break;
      default:
        response.data = await stageOne.text();
        break;
    }
  }

  return response as AxiosResponse;
}

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config: any) {
  const headers = config.headers;

  // HTTP basic authentication
  if (config.auth) {
    const username = config.auth.username || '';
    const password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : '';
    headers['Authorization'] = `Basic ${btoa(username + ':' + password)}`;
  }

  const method = config.method.toUpperCase();
  const options: RequestInit = {
    headers: headers as Record<string, string>,
    method,
  };
  if (method !== 'GET' && method !== 'HEAD') {
    options.body = config.data;
  }
  if (config.mode) {
    options.mode = config.mode;
  }
  if (config.cache) {
    options.cache = config.cache;
  }
  if (config.integrity) {
    options.integrity = config.integrity;
  }
  if (config.redirect) {
    options.integrity = config.redirect;
  }
  if (config.referrer) {
    options.referrer = config.referrer;
  }
  // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
  // So if withCredentials is not set, default value 'same-origin' will be used
  if (!isUndefined(config.withCredentials)) {
    options.credentials = config.withCredentials ? 'include' : 'omit';
  }

  const fullPath = buildFullPath(config.baseURL, config.url);
  const url = buildURL(fullPath, config.params, config.paramsSerializer);

  // Expected browser to throw error if there is any wrong configuration value
  return { options, url };
}
