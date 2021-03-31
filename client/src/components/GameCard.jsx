import React from 'react'
import styled, { css } from 'styled-components'

function GameCard() {
    const Button = styled.button`
        background: white;
        border-radius: 3px;
        border: 2px solid palevioletred;
        color: white;
        margin: 0 1em;
        padding: 0.25em 1em;
    `
    

    return (
        <div className='card__Container'>
            <Button>Soy un Botón xd!</Button>
            
        </div>
    )
}

export default GameCard;
