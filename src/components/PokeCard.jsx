import { useEffect } from "react"
import { useState } from "react"
import TypeCard from './TypeCard'
import { getPokedexNumber } from "../utils"
import { getFullPokedexNumber } from "../utils"
import Modal from './Modal'

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null) // sets the display data for each pokemon
    const [loading, setLoading] = useState(false)
    const { name, height, abilities, stats, types, moves, sprites } = data || {} // if data is null, then we will set all of these to null
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    // filter empty sprite elements from the list in api
    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }

        // check cache
        let cache = {}
        if (localStorage.getItem('pokemon-moves')) {
            cache = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in cache) {
            setSkill(cache[move])
            console.log('found move in cache')
            return
        }

        try {
            setLoadingSkill
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('fetched move data', moveData)
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }

            setSkill(skillData)

            cache[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cache))

        } catch (err) {
            console.log(err.message)
        } finally {
            setLoadingSkill(false)
        }
        setLoadingSkill(false)
    }

    useEffect(() => { // this is a hook that runs every time the selectedPokemon changes
        if (loading || !localStorage) {
            return
        }

        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex')) // if the database exists, then we have access to all this information
        }

        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon]) // if the selected pokemon is in the cache, we will set the data to the cache
            console.count("found pokemon in cache")
            return
        }

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log("fetched from api pokemon data")
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

    }, [selectedPokemon])

    if (loading || !data) {
        return <div>loading...</div>
    }

    // Sort moves alphabetically by move.name
    const sortedMoves = moves.sort((a, b) => a.move.name.localeCompare(b.move.name))

    return (
        <div className="poke-card">
            {skill && (<Modal handleCloseModal={() => { setSkill(null) }}>
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <img className="default-image" src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"} alt="Pokemon Image" />
            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={"sprite"} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {sortedMoves.map((moveObj, moveIndex) => {
                    return (
                        <button className='pokemon-move' key={moveIndex} onClick={() => { fetchMoveData(moveObj?.move?.name, moveObj?.move?.url) }}>
                            <p>{moveObj?.move?.name}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}