import React from 'react'
import styled from 'styled-components';
import { useSelector } from 'react-redux';


const DetailWrapper = styled.div`
    color: white;
`

const Detail = styled.div`
    color:white;
`

const Label = styled.label`
    color:white;
`

const QtButton = styled.button`
    margin: 0 5px;
    padding: 8px 14px;
    background: rgba(155, 155, 155, 0.2);
    color: #fff;
    cursor: pointer;
    border: 2px solid #fff;
    outline: 0;
    font-weight: 300;
    :hover { 
        opacity: 0.8;
    }
    :active {
        background: black;
    }
`

export function GameDetail() {
    const game = useSelector((state) => state.gameDetail)

    console.log('++++++++++++++++++++'+game.name)
    return (
        <DetailWrapper>
            <h4 >Game Information</h4>
            <Detail>
                <Label>Game Name:</Label>
                <br></br>
                <span>{game.name}</span>
                <hr></hr>
                <Label>Description: </Label>
                <br></br>
                <span>{game.description}</span>
                <hr></hr>
                <Label>Release Date: </Label>
                <span>{game.released || game.launchDate}</span>
                <hr></hr>
                <Label> Genres:  </Label>
                {Array.isArray(game.genres) && game.genres.map(item => {
                    return(
                        <QtButton>{item}</QtButton>
                    )
                })
                }
                <hr></hr>
                <Label>Platforms: </Label>
                {Array.isArray(game.platforms) && game.platforms.map(item => {
                    return(
                        <QtButton>{item}</QtButton>
                    )
                })}
            </Detail>
        </DetailWrapper>
    )

}

