import React, { useState, useEffect } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import api from "../../../config.js";
import "../styles/_discover.scss";
import { useSearchParams } from "react-router-dom";

export default function Discover() {
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlayLists] = useState([]);
  const [categories, setCategories] = useState([]);

  const [bearerToken, setBearerToken] = useState(undefined);
  const [code, setCode] = useState(undefined);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryParamCode = searchParams.get("code");

    if (queryParamCode && queryParamCode !== code) {
      setCode(queryParamCode);
    }

    if (!queryParamCode) {
      window.location = `https://accounts.spotify.com/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&client_id=${api.clientId}`;
    }
  }, [code, searchParams]);

  useEffect(() => {
    if (!code || bearerToken) {
      return;
    }

    var details = {
      redirect_uri: "http://localhost:3000",
      grant_type: "authorization_code",
      code: code,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const basicAuthSecret = new Buffer(
      api.clientId + ":" + api.clientSecret
    ).toString("base64");

    fetch(api.authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuthSecret}`,
      },
      body: formBody,
    }).then((response) => {
      response.json().then((data) => {
        setBearerToken(data.access_token);
      });
    });
  }, [code, bearerToken]);

  useEffect(() => {
    if (!bearerToken) {
      return;
    }

    fetch(`${api.baseUrl}/browse/new-releases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json"
      },
    }).then((response) => {
      response.json().then((data) => {
        setNewReleases(data.albums.items);
      });
    });

    fetch(`${api.baseUrl}/browse/featured-playlists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json"
      },
    }).then((response) => {
      response.json().then((data) => {
        setPlayLists(data.playlists.items);
      });
    });

    fetch(`${api.baseUrl}/browse/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json"
      },
    }).then((response) => {
      response.json().then((data) => {
        setCategories(data.categories.items);
      });
    });
  }, [bearerToken]);

  return (
    <div className="discover">
      <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
      <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
    </div>
  );
}
