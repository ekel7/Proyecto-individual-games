import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../styles/logo.png';

import '../styles/NavBar.css'

export default function NavBar() {
    return (
        <header className='navbar'>
            <div>
                <img id='logo' src = {Logo} width='30' height='30' className='logo-img' alt=''/>
            </div>
            <nav>
                <ul className='listaLinks'>
                    <li className='itemLista'>
                        <NavLink exact to='/videogames'>Home</NavLink>
                    </li>
                    <li className='itemLista'>
                        <NavLink to='/videogame/create'>Add Game</NavLink>
                    </li>
                </ul>
            </nav>
        </header>

    )
}