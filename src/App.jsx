'use client';
import React from "react";
import { Route, Switch } from "wouter";
import TablePage from "/src/components/TablePage";
import ContactForm from "/src/components/ContactForm/ContactForm";

const App = () => (
  <div>
    <Switch>
      <Route path="/" component={TablePage} />
      <Route path="/contact" component={ContactForm} />
      <Route>404: No such page!</Route>
    </Switch>
    {/* <TablePage /> */}
  </div>
);

export default App;