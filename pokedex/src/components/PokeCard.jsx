import { useEffect } from "react"
import { useState } from "react"
import { getPokedexNumber } from "../utils"
export function PokeCard(props){

    const {selectedPokemon} = props

    const [data, setData] = useState(null) //sets the display data for each pokemon

    const [loading, setLoading] = useState(false)

    useEffect(() => { //this is a hook that runs every time the selectedPokemon changes
        // if loading, exit
        if (loading || !localStorage){
            return 
        }

        //check if the selected pokemon informatino is already in the cache
            //1. define the cache - since the info we get from the api is of type object, we will create the cache as an object
            let cache = {}
            if (localStorage.getItem('pokedex')){
                cache = JSON.parse(localStorage.getItem('pokedex')) //if the database exists, then we have access to all this informatino
            }

            //2. check if the selected pokemon is in the cache, otherwise fetch from the API
            if (selectedPokemon in cache){
                setData(cache[selectedPokemon]) //if the selected pokemon is in the cache, we will set the data to the cache
                console.count("found pokemon in cache")
                return
            }

        async function fetchPokemonData(){
            setLoading(true)
            try{
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log(pokemonData)
                cache[selectedPokemon] = pokemonData 
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch(err){
                console.log(err.message)
            } finally{
                setLoading(false)
            }
        }

        fetchPokemonData()

        //if we fetch from the api, make sure the save the information in the cache

        //these things will prevent us from getting banned by the API (too many requests)

        //caching is only required when the data is not changing frequently

    }, [selectedPokemon]) 

    return(
        <div>
            
        </div>
    )
}