"use client";

import React, { useState, useEffect } from "react";
import "bulma/css/bulma.css";

const Funds = () => {
  const [standardState, setStandardState] = useState<number | undefined>();
  const [extraState, setExtraState] = useState<number | undefined>();

  const changeStandard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStandardState(Number(e.target.value));
  };

  const changeExtra = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraState(Number(e.target.value));
  };

  const submitFunds = () => {
    let funds = { standard: standardState, extra: extraState };
    setStandardState(undefined);
    setExtraState(undefined);
    console.log(funds);
  };

  return (
    <main className="has-background-primary-dark">
      <section className="field">
        <label className="label">Standard funds</label>
        <div className="control">
          <input
            className="input"
            type="number"
            placeholder="$500"
            value={standardState || ""}
            onChange={changeStandard}
          />
        </div>
      </section>

      <section className="field">
        <label className="label">Extra Funds</label>
        <div className="control">
          <input
            className="input"
            type="number"
            value={extraState || ""}
            onChange={changeExtra}
          />
        </div>
      </section>

      <section className="control">
        <div className="button is-primary" onClick={() => submitFunds()}>
          Submit
        </div>
      </section>
    </main>
  );
};

export default Funds;
