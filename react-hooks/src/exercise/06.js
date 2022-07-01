// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  ErrorFallback,
  PokemonErrorBoundary,
} from '../pokemon';

class ErrorBoundary extends React.Component {
  state = {error: null};
  static getDerivedStateFromError(error) {
    return {error};
  }

  render() {
    console.log('error', this.state.error);
    return this.props.children;
  }
}

function PokemonInfo({pokemonName}) {
  const [pageInfo, setPageInfo] = React.useState({
    currentPokemon: null,
    status: 'idle',
    error: null,
  });

  const {currentPokemon, status, error} = pageInfo;

  React.useEffect(() => {
    if (!pokemonName) return;

    setPageInfo({status: 'pending'});

    fetchPokemon(pokemonName).then(
      response => {
        setPageInfo({status: 'resolved', currentPokemon: response});
      },
      err => {
        setPageInfo({status: 'rejected', error: err});
      },
    );
  }, [pokemonName]);

  if (status === 'idle') {
    return 'Submit a pokemon';
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === 'rejected') {
    throw new Error('test error');
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        {/* <button onClick={resetErrorBoundary}>Try again</button> */}
      </div>
    );
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={currentPokemon} />;
  }

  throw new Error('This should be impossible');
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
