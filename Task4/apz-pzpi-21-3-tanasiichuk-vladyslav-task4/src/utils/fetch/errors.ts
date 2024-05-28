interface FetchRequestInfo {
  method: string;
  status: number;
  url: string;
}

export class FetchError extends Error {
  constructor(public errorMessage: string, public requestInfo: FetchRequestInfo) {
    const { method, status, url } = requestInfo;

    super(
      `Fetch error (${status}) occured while calling ${method} ${url}.\nError message: ${errorMessage}`
    );
  }
}
