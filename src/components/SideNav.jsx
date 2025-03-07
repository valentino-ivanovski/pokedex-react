import { useState } from "react";
import { first151Pokemon } from "../utils";
import { getFullPokedexNumber } from "../utils";

export default function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu } = props;

  const [searchValue, setSearchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    if (getFullPokedexNumber(eleIndex).includes(searchValue)) return true;
    if (ele.toLowerCase().includes(searchValue.toLowerCase())) return true;
    return false;
  });

  // Add Lola as the last entry
  filteredPokemon.push("Lola");

  return (
    <nav className={` ${!showSideMenu ? "open" : ""}`}>
      <div className={`header ${!showSideMenu ? "open" : ""}`}>
        <button onClick={handleCloseMenu} className="open-nav-button">
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input
        placeholder="Search name or id..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = pokemon === "Lola" ? "💖" : getFullPokedexNumber(first151Pokemon.indexOf(pokemon));
        return (
          <button
            onClick={() => {
              setSelectedPokemon(pokemon === "Lola" ? -1 : first151Pokemon.indexOf(pokemon));
              handleCloseMenu();
            }}
            key={pokemonIndex}
            className={`nav-card ${selectedPokemon === (pokemon === "Lola" ? -1 : first151Pokemon.indexOf(pokemon)) ? "nav-card-selected" : ""}`}
          >
            <p>{truePokedexNumber}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}