export function replaceQueryParams(paramsObject: { [key: string]: string }) {
  // Create a URLSearchParams object with the current search parameters
  const searchParams = new URLSearchParams();

  // Add or update a query parameter
  Object.entries(paramsObject).forEach((entry) => {
    searchParams.set(entry[0], entry[1]);
  });
  console.log("searchParams:", searchParams);
  // Construct the new URL
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams}`;

  // Replace the current history entry with the new URL
  window.history.replaceState({}, "", newUrl);
}

export function clearQueryParams() {
  // Construct the new URL
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  // Replace the current history entry with the new URL
  window.history.replaceState({}, "", newUrl);
}

export function getQueryParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const stringObject: { [key: string]: string } = {};
  Object.entries(params).forEach((entry) => {
    stringObject[`${decodeURI(entry[0])}`] = `${decodeURI(entry[1])}`;
  });
  return stringObject;
}

export function updateQueryParams(key: string, value: string) {
  const currentParams = getQueryParams();
  currentParams[encodeURIComponent(key)] = encodeURIComponent(value);
  replaceQueryParams(currentParams);
}