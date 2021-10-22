import { generateAuthUrl } from "../utils/helperFunction";
import { characterUrl, comicsUrl, seriesUrl } from "./configuration";

const getCharacterList = (offset, name) =>
  generateAuthUrl(characterUrl(), offset, name);

const getCharacterById = (id) => generateAuthUrl(`${characterUrl()}/${id}`);

const getComicsList = (offset, name) =>
  generateAuthUrl(comicsUrl(), offset, name);

const getComicsById = (id) => generateAuthUrl(`${comicsUrl()}/${id}`);

const getSeriesList = (offset, name) =>
  generateAuthUrl(seriesUrl(), offset, name);

const getSeriesById = (id) => generateAuthUrl(`${seriesUrl()}/${id}`);

export {
  getCharacterList,
  getCharacterById,
  getComicsList,
  getComicsById,
  getSeriesList,
  getSeriesById,
};
