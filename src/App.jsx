import Header from "./components/Header"
import PokeCard from "./components/PokeCard"
import SideNav from "./components/SideNav"

import { useState } from "react"

function App() {

  const [selectedPokemon, setSelectedPokemon] = useState(5)

  return (
    <>
      <Header />
      <SideNav selectedPokemon = {selectedPokemon} setSelectedPokemon = {setSelectedPokemon} />
      <PokeCard selectedPokemon = {selectedPokemon} />
    </>
  )
}

export default App
