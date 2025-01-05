import {useEffect} from 'react'

export function PokeCard(props){
    const {selectedPokemon} = props

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        // if loading, exit logic
        if (loading || !localStorage) {return}
        // check if the selected pokemon information is available in the cache
            // 1. define the cache
            let cache = {}
            if (localStorage.getItem('pokedex')) {
                cache = JSON.parse(localStorage.getItem('pokemon'))
            }
            // 2. check if the selected pokemon is in the cache, otherwise fetch from the API
            if (selectedPokemon in cache) {
                setData(cache[selectedPokemon]) //we read from the cache to avoid making unnecessary API calls
                return
            }

        // fetch the selected pokemon information from the API
        
            
        // if we fetch from the api, make sure to save the information to the cache for next time

    }, [selectedPokemon])

    return(
        <div></div>
    )
}