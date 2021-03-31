import React,{ useEffect} from 'react';
import { useDispatch } from 'react-redux'
import Router from 'react-router-dom';
import { loadGenres } from '../actions';
import '../styles/LandingPage.css';

export function LandingPage(){

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGenres())    
            
    }, [])

    return (
        <div className='landing__Wrapper'>
            <h4>
                :D
            </h4>
        </div>
    )
}