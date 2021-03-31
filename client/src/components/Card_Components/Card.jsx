import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { loadSingleGameData } from '../../actions/index'

const StyledContainer = styled.div`
    border: 1px solid #4646fd; 
    padding: 25px 0px 18px;
    background-image: ${props => `url(${props.background})`} ;
    background-size: cover;
    width: 300px;
    height: 130px;
    
    .background2{
        background-color: rgba(0,0,0,0.5);
        
    }

    `

const StyledTitle = styled(Link)`
    
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    font-size: 24px;
    text-shadow: 3px 3px 3px #383737;
`

const Date = styled.div`
    color: #ccc;
    font-weight: 600;
    margin: 6px 0;
    text-shadow: 3px 3px 3px #383737;
`

const Description = styled.p`
    color: #fff;
    font-weight: 300;
`

const Action = styled.button`
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

const Actions = styled.div`
    color: #333;
    display:flex;
    align-items: center;
    svg {
        transform: translateY(2px);
        margin-right: 5px;
    }
`

const Card = (props) => {
    const dispatch = useDispatch();

    function handleGameSelection (id) {
        console.log('me ejecute xd')
        dispatch(loadSingleGameData(id))
    }

    return(
    <StyledContainer background={props.background}>
        <div className="background2">
        <StyledTitle to={`/videogame/detail/${props.id}`} onClick={e => handleGameSelection(props.id)}>{props.title}</StyledTitle>
        <Date>Release Date: {props.date}</Date>
        <Description>{props.description}</Description>
        <Actions>
            {props.genres.map(genre => (
                <Action >{genre.name}</Action>
            ))}
        </Actions>
        </div>
    </StyledContainer>

)}
    
export default Card
