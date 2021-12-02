const express = require("express");
const bluebird = require("bluebird");

const redis = require("redis");
const client = redis.createClient();

const router = express.Router();
const { getShowById, allShows, findShows } = require("../api");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const showData = "showData";
const sortedSet = "sortedSet";

router.get("/", async (_, res) => {
  try {
    const showDetails = await allShows();

    const isPageCached = await client.existsAsync(showData);

    if (isPageCached) {
      console.log("Getting data from cache!");
      const showPage = await client.getAsync(showData);
      return res.send(showPage);
    }

    return res.render(
      "home",
      {
        showDetails: showDetails,
      },
      async (_, html) => {
        await client.setAsync(showData, html);
        console.log("Caching all shows");
        res.send(html);
      }
    );
  } catch (error) {
    res.status(500).render("error", {
      title: "Something went wrong",
      errorMessage: "Something went wrong while fetching all shows",
    });
  }
});

router.get("/show/:id", async (req, res) => {
  try {
    const id = req?.params?.id;

    if (!id) {
      return res.status(404).render("error", {
        title: "Id is not valid",
        errorMessage: "Please enter valid id",
      });
    }

    const isCachedDetailPage = await client.existsAsync(id);

    if (isCachedDetailPage) {
      console.log("Getting from cache");
      const detailPage = await client.getAsync(id);
      return res.send(detailPage);
    }

    const showDetails = await getShowById(id);

    const showPayload = {
      ...showDetails,
      summary: showDetails.summary?.replace(/<(.|\n)*?>/g, ""),
    };

    res.render(
      "show",
      {
        showDetails: showPayload,
      },
      async (_, html) => {
        await client.setAsync(id, html);
        console.log("Caching show detail page with id: " + id);
        res.send(html);
      }
    );
  } catch (error) {
    res.status(404).render("error", {
      title: "Show Not Found",
      errorMessage: error,
    });
  }
});

router.post("/search", async (req, res) => {
  try {
    const searchValue = req?.body?.searchTerm;

    if (searchValue?.trim().length === 0) {
      return res.status(400).render("error", {
        title: "Invalid search text",
        errorMessage: "Please enter a valid search text",
      });
    }

    const key = "key_" + searchValue.toLowerCase();
    await client.zincrbyAsync(sortedSet, 1, key);

    const isCachedSearch = await client.existsAsync(searchValue);

    if (isCachedSearch) {
      console.log("Getting search from cache");
      const cachedSearchPage = await client.getAsync(searchValue);
      return res.send(cachedSearchPage);
    }

    const showList = await findShows(searchValue);
    const finalShowsPayload =
      showList &&
      showList.filter((show, index) => {
        if (index < 20) {
          return show;
        }
      });

    res.render(
      "search",
      {
        showList: finalShowsPayload,
        searchTerm: searchValue,
      },
      async (_, html) => {
        await client.setAsync(searchValue, html);
        console.log("Caching search html page");
        res.send(html);
      }
    );
  } catch (error) {
    res.status(500).render("error", {
      title: "Something went wrong",
      errorMessage: "Something went wrong while searching all shows",
    });
  }
});

router.get("/popularsearches", async (_, res) => {
  try {
    const topList = await client.zrevrangebyscoreAsync(
      sortedSet,
      10,
      0,
      "WITHSCORES"
    );

    const topSearchTerm = [];
    if (topList.length !== 0) {
      for (let i = 0; i < topList.length; i += 2) {
        let searchTerm = topList[i].slice(4, topList[i].length);
        topSearchTerm.push(searchTerm);
      }
    }

    res.render("popularlist", {
      topSearchTerm: topSearchTerm.slice(0, 10),
    });
  } catch (error) {
    res.status(500).render("error", {
      title: "Something went wrong",
      errorMessage: error,
    });
  }
});

module.exports = router;
