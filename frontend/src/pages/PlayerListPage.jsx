import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';

// components
import Rankings from '../components/Rankings';

// libraries
import axios from 'axios'

// contexts
import { useSearchParamsContext } from '../Contexts/SearchParamsContext';

const PlayerListPage = ({ playerGender }) => {

    const { searchParams, updateSearchParams } = useSearchParamsContext();
    const location = useLocation()
    const rankingsWrapperRef = useRef()

    const [playersFiltered, setPlayersFiltered] = useState([])
    const [playersCountries, setPlayersCountries] = useState([])
    const [pageCurr, setPageCurr] = useState(1)
    const [pagesCount, setPagesCount] = useState()
    const [querySearch, setQuerySearch] = useState(() => {
        const query = new URLSearchParams(location.search);
        return query.get('search') || 'default';
    });

    const players_fetch = async () => {
        const players_filtered = `${import.meta.env.VITE_SERVER}/players/${playerGender}?${searchParams}`
        await axios
            .get(players_filtered)
            .then((res) => {
                setPlayersFiltered(res.data.returnPlayers)
                setPlayersCountries(res.data.countries)
                setPagesCount(res.data.numPages)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const player_remove = async (e, id) => {
        const player = `${import.meta.env.VITE_SERVER}/players/${playerGender}/${id}`
        await axios
            .delete(player)
            .then(() => {
                players_fetch()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        players_fetch()
    }, [searchParams])

    useEffect(() => {

        const query = new URLSearchParams(location.search);
        const currentSearch = query.get('search') || 'default';

        if (querySearch !== currentSearch) {
            setQuerySearch(currentSearch)
            setPageCurr(1)
            updateSearchParams('page', 1);
        } else {
            updateSearchParams('page', pageCurr)
        }
    }, [playersFiltered?.length, location.pathname, location.search, querySearch])

    const resetState = () => {
        setPlayersFiltered([]);
        setPlayersCountries([]);
        setPagesCount(0);
        setPageCurr(1);
        updateSearchParams('country', null);
        updateSearchParams('sort', null);
        updateSearchParams('search', null);
    };

    useEffect(() => {
        resetState()
        players_fetch()
    }, [playerGender]);

    return (
        <section className='player-list'>
            <div className='player-list__wrapper'>
                <h2 className='sr-only'>Player List route</h2>
                <section className='rankings-section'>
                    <div className='rankings-section__wrapper'>
                        <h3 className='sr-only'>Player List rankings</h3>
                        {
                            playersFiltered?.length > 0
                                ?
                                (
                                    <Rankings
                                        playerGender={playerGender}
                                        playersCountries={playersCountries}
                                        playersFiltered={playersFiltered}
                                        player_remove={player_remove}
                                        pageCurr={pageCurr}
                                        pagesCount={pagesCount}
                                        setPageCurr={setPageCurr}
                                        ref={rankingsWrapperRef}
                                    />
                                )
                                :
                                (
                                    <div className='rankings-section__noplayer'>
                                        <p>List is empty</p>
                                    </div>
                                )
                        }
                    </div>
                </section>
            </div>
        </section>
    )
}

export default PlayerListPage

