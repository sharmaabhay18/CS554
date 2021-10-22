import md5 from "blueimp-md5";

const calPageCount = (response) => {
  return Math.ceil(response?.total / response?.limit);
};

const generateAuthUrl = (baseUrl, offset, name) => {
  const ts = new Date().getTime();
  const stringToHash =
    ts + process.env.REACT_APP_PRIVATE_KEY + process.env.REACT_APP_PUBLIC_KEY;
  const hash = md5(stringToHash);

  const splitBaseUrl = baseUrl.split("/");
  const getCurrentApi = splitBaseUrl[splitBaseUrl.length - 1];

  console.log("getCurrentApi", getCurrentApi);

  let url;
  if (name && name.length !== 0) {
    if (getCurrentApi === "characters") {
      url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        process.env.REACT_APP_PUBLIC_KEY +
        "&hash=" +
        hash +
        "&nameStartsWith=" +
        name +
        "&offset=" +
        offset;
    } else {
      url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        process.env.REACT_APP_PUBLIC_KEY +
        "&hash=" +
        hash +
        "&titleStartsWith=" +
        name +
        "&offset=" +
        offset;
    }
  } else {
    url =
      baseUrl +
      "?ts=" +
      ts +
      "&apikey=" +
      process.env.REACT_APP_PUBLIC_KEY +
      "&hash=" +
      hash +
      "&offset=" +
      offset;
  }

  return url;
};

export { generateAuthUrl, calPageCount };
