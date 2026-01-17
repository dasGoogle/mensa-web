/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Additive {
  /** The name of the additive */
  name: string;
  /** The abbreviation of the additive */
  abbreviation: string;
}

export interface Allergen {
  /** The name of the allergen */
  name: string;
  /** The abbreviation of the allergen */
  abbreviation: string;
}

export interface Feature {
  /** The name of the feature */
  name: string;
  /** The abbreviation of the feature */
  abbreviation: string;
}

export interface Location {
  /** The name of the location */
  name: string;
  /**
   * The numerical ID used to access the the data for the location at the API
   * @format double
   */
  id: number;
}

export interface NutritionInformation {
  /**
   * The energy of the meal in kJ
   * @format double
   */
  kj: number;
  /**
   * The energy of the meal in kcal
   * @format double
   */
  kcal: number;
  /**
   * The fat of the meal in g
   * @format double
   */
  fat: number;
  /**
   * The saturated fat of the meal in g
   * @format double
   */
  saturatedFat: number;
  /**
   * The carbohydrates of the meal in g
   * @format double
   */
  carbohydrates: number;
  /**
   * The sugar of the meal in g
   * @format double
   */
  sugar: number;
  /**
   * The protein of the meal in g
   * @format double
   */
  protein: number;
  /**
   * The salt of the meal in g
   * @format double
   */
  salt: number;
}

export interface Meal {
  /** The name of the meal */
  name: string;
  /**
   * The price of the meal for students
   * @format double
   */
  studentPrice: number;
  /**
   * The price of the meal for employees
   * @format double
   */
  employeePrice: number;
  /**
   * The price of the meal for guests
   * @format double
   */
  guestPrice: number;
  /**
   * The when the meal is available
   * @format date-time
   */
  date: string;
  /** The allergens of the meal */
  allergens: Allergen[];
  /** The additives of the meal */
  additives: Additive[];
  /** The features of the meal */
  features: Feature[];
  /** Whether the meal is an evening meal */
  isEveningMeal: boolean;
  /**
   * The id of the meal
   * @format double
   */
  id: number;
  /** The nutrition information of the meal */
  nutritionInformation: NutritionInformation;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title mensa-api
 * @version 1.0.0
 * @license MIT
 * @baseUrl /
 * @contact Aaron Schlitt
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  additives = {
    /**
     * @description Retrieve a list of all additives available at a location
     *
     * @name GetAdditives
     * @request GET:/additives/{location}
     */
    getAdditives: (
      location: string,
      query?: {
        /**
         * The language in which to return the additives. Currently supported: en, de
         * @default "en"
         */
        lang?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Additive[], any>({
        path: `/additives/${location}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  allergens = {
    /**
     * @description Retrieve all allergens available at a location
     *
     * @name GetAllergens
     * @request GET:/allergens/{location}
     */
    getAllergens: (
      location: string,
      query?: {
        /**
         * The language in which to return the allergens. Currently supported: en, de
         * @default "en"
         */
        lang?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Allergen[], any>({
        path: `/allergens/${location}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  features = {
    /**
     * @description Retrieve all features a meal can have at a given location (i.e., being vegan, vegetarian, etc.)
     *
     * @name GetFeatures
     * @request GET:/features/{location}
     */
    getFeatures: (
      location: string,
      query?: {
        /**
         * The language in which to return the meals. Currently supported: en, de
         * @default "en"
         */
        lang?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Feature[], any>({
        path: `/features/${location}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  locations = {
    /**
     * @description Retrieve all locations available at the API
     *
     * @name GetLocations
     * @request GET:/locations
     */
    getLocations: (params: RequestParams = {}) =>
      this.request<Location[], any>({
        path: `/locations`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  meals = {
    /**
     * @description Retrieves all meals available at a location that match the given filters. The meals contain details on prices, allgergens, etc.
     *
     * @name GetMeals
     * @request GET:/meals/{location}
     */
    getMeals: (
      location: string,
      query?: {
        /** The date for which to retrieve meals. Format: YYYY-MM-DD */
        date?: string;
        /** Whether to retrieve evening meals or not. If not specified, all meals are returned. */
        evening?: boolean;
        /**
         * The language in which to return the meals. Currently supported: en, de
         * @default "en"
         */
        lang?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Meal[], any>({
        path: `/meals/${location}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
