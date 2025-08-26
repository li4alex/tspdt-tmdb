'use client';
import React from "react";
import { Link, Route, Switch } from "wouter";
import TablePage from "/src/components/TablePage";
import Contact from "/src/components/Contact";

const App = () => (
  <div>
    <Switch>
      <Route path="/" component={TablePage} />
      <Route path="/contact" component={Contact} />
      <Route>404: No such page!</Route>
    </Switch>
      
    <Link href="/contact">
      <a className="link">Contact</a>
    </Link>
    {/* <TablePage /> */}
  </div>
);

export default App;