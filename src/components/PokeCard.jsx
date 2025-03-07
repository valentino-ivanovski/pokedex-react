import { useEffect, useState } from "react";
import TypeCard from "./TypeCard";
import { getPokedexNumber, getFullPokedexNumber } from "../utils";
import Modal from "./Modal";

export default function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { name, height, abilities, stats, types, moves, sprites } = data || {};
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  // Lola's custom data
  const lolaData = {
    name: "Lola",
    types: [{ type: { name: "fairy" } }],
    stats: [
      { stat: { name: "hp" }, base_stat: 100 },
      { stat: { name: "attack" }, base_stat: 50 },
      { stat: { name: "defense" }, base_stat: 70 },
      { stat: { name: "special-attack" }, base_stat: 90 },
      { stat: { name: "special-defense" }, base_stat: 85 },
      { stat: { name: "speed" }, base_stat: 60 },
    ],
    moves: [
      { move: { name: "love-beam", url: null } },
      { move: { name: "cute-wink", url: null } },
      { move: { name: "hug-attack", url: null } },
      { move: { name: "charm-blast", url: null } },
    ],
    sprites: {
      front_default: "/pokemon/💖-front.png",
      back_default: "/pokemon/💖-back.png",
      front_shiny: "/pokemon/💖-front-shiny.png",
      back_shiny: "/pokemon/💖-back-shiny.png",
    },
  };

  // Filter sprite keys
  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (["versions", "other"].includes(val)) return false;
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage) return;

    // Handle Lola’s custom moves
    if (!moveUrl) {
      const customDescriptions = {
        "love-beam": "A dazzling beam of affection that melts Tino's heart.",
        "cute-wink": "A wink so cute it confuses her bf.",
        "hug-attack": "An overwhelming hug that crushes her bf with love.",
        "charm-blast": "A burst of charm that leaves Tino stunned.",
      };
      setSkill({ name: move, description: customDescriptions[move] });
      return;
    }

    let cache = JSON.parse(localStorage.getItem("pokemon-moves")) || {};
    if (move in cache) {
      setSkill(cache[move]);
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      const description = moveData?.flavor_text_entries.find(
        (val) => val.version_group.name === "firered-leafgreen"
      )?.flavor_text;
      const skillData = { name: move, description };
      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    if (loading || !localStorage) return;

    // Lola case
    if (selectedPokemon === -1) {
      setData(lolaData);
      setLoading(false);
      return;
    }

    let cache = JSON.parse(localStorage.getItem("pokedex")) || {};
    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      return;
    }

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon]);

  if (loading || !data) {
    return <div>loading...</div>;
  }

  const sortedMoves = moves.sort((a, b) => a.move.name.localeCompare(b.move.name));

  return (
    <div className="poke-card">
      {skill && (
        <Modal handleCloseModal={() => setSkill(null)}>
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{selectedPokemon === -1 ? "💖" : getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => (
          <TypeCard key={typeIndex} type={typeObj?.type?.name} />
        ))}
      </div>
      <img
        className="default-image"
        src={selectedPokemon === -1 ? "/pokemon/💖.png" : `/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
        alt="Pokemon Image"
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIndex) => (
          <img key={spriteIndex} src={sprites[spriteUrl]} alt="sprite" />
        ))}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => (
          <div key={statIndex} className="stat-item">
            <p>{statObj.stat.name}</p>
            <h4>{statObj.base_stat}</h4>
          </div>
        ))}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {sortedMoves.map((moveObj, moveIndex) => (
          <button
            className="pokemon-move"
            key={moveIndex}
            onClick={() => fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}
          >
            <p>{moveObj?.move?.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}