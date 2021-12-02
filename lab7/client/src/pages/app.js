import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import LandingPage from "./LandingPage";
import Pokemon from "./Pokemon";
import PokemonDetails from "./PokemonDetails";
import Trainer from "./Trainer";

import Error from "../components/Error";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/pokemon/page/:pagenum" component={Pokemon} />
        <Route exact path="/pokemon/:id" component={PokemonDetails} />
        <Route exact path="/trainers" component={Trainer} />
        <Route component={Error} />
      </Switch>
    </Router>
  );
};

export default App;
