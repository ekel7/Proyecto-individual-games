import './App.css';
import NavBar from './components/NavBar';
import { Home } from './components/Home';
import { GameDetail } from './components/GameDetail'
import { LandingPage } from './components/LandingPage'
// import { GameDetail } from './components/GameDetail'
// import { GameCreation } from './components/GameCreation'
import { Route } from 'react-router-dom';
import { GameCreation } from './components/GameCreation';

function App() {
  return (
    <div className="App">
      <NavBar />
      <h1>Videogames WebApp</h1>
      <Route exact path='/' component={LandingPage}/>
      <Route exact path='/videogames' component={Home}/>
      <Route exact path='/videogame/create' component={GameCreation}/>
      <Route exact path ='/videogame/detail/:id' component={GameDetail}/>
    </div>
  );
}

export default App;
