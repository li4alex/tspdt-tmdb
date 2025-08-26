'use client';
import React from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Link, Route, Switch } from "wouter";
import TablePage from "/src/components/TablePage";

ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => (
  <div>
    {/* <Switch>
      <Route path="/" component={TablePage} />
      <Route>404: No such page!</Route>
    </Switch>
      
    <Link href="/contact">
      <a className="link">Contact</a>
    </Link> */}
    <TablePage />
  </div>
);

export default App;