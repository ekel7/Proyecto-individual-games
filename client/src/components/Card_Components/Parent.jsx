import React from 'react'
import Card from './Card'
import styled from 'styled-components'

const StyledRoot = styled.div`
    padding: 50px 0 50px;
    width: 100%;
    overflow-x: scroll;
`

const StyledContainer = styled.div`
    margin: auto;
    display: flex;
    flex-flow: wrap;
    justify-content: center;
`

const Parent = ({games}) => {
    

       
    return (
        <StyledRoot>
            <StyledContainer>
                {games.map(g => <Card
                            title={g.name}
                            date={g.released}
                            description=''
                            background={g.background_image}
                            id={g.id}
                            to='/videogame/'
                            genres={g.genres}
                        /> )}
                    
            </StyledContainer>
        </StyledRoot>
    )
}

export default Parent
