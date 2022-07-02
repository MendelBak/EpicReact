// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon';

class ErrorBoundary extends React.Component {
  state = {error: null};
  static getDerivedStateFromError(error) {
    return {error};
  }

  render() {
    const {error} = this.state;
    console.log('error', error);

    if (error) {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
          {/* <button onClick={resetErrorBoundary}>Try again</button> */}
        </div>
      );
    }
    return this.props.children;
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
    </div>
  );
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
    throw error;
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
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
