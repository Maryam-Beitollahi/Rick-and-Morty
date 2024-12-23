import { useEffect, useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Loader from "./Loader";
import toast, { ErrorIcon, Toaster } from "react-hot-toast";

function CharecterDetail({ selectedId, onAddFavourite, isAddedToFavourite }) {
  const [character, setCharacter] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        //setCharacter(null);// if we had error, it will display nothing
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e) => e.split("/").at(-1));
        const { data: episodeData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodeData].flat().slice(0, 4));
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) fetchData();
  }, [selectedId]);

  if (isloading)
    return (
      <div style={{ flex: 1 }}>
        <Loader />
      </div>
    );

  if (!character || !selectedId)
    return (
      <div style={{ flex: 1, color: "var(--slate-300)" }}>
        Please select a character
      </div>
    );
  return (
    <div style={{ flex: 1 }}>
      <CharacterSubinfo
        character={character}
        isAddedToFavourite={isAddedToFavourite}
        onAddFavourite={onAddFavourite}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
}

export default CharecterDetail;

function CharacterSubinfo({ character, isAddedToFavourite, onAddFavourite }) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "👱🏻‍♂️" : "👩🏻‍🦳"}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span>-&nbsp;{character.species}</span>
        </div>
        <div className="location">
          <p>Last known location:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddedToFavourite ? (
            <p>Already added to favourites</p>
          ) : (
            <button
              onClick={() => onAddFavourite(character)}
              className="btn btn--primary"
            >
              Add to favourite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodeList({ episodes }) {
  const [sortby, setSortby] = useState(true);
  let sortedEpisodes;
  if (sortby) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }
  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of Episodes:</h2>
        <button onClick={() => setSortby((is) => !is)}>
          <ArrowUpCircleIcon className="icon" style={{rotate: sortby ? "0deg" : "180deg"}}/>
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => {
          return (
            <li key={item.id}>
              <div>
                {String(index + 1).padStart(2, "0")} {item.episode} :{" "}
                <strong>{item.name}</strong>
              </div>
              <div className="badge badge--secondary">{item.air_date}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
