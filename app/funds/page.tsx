"use client";

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { firebaseConfig } from "../utils/utils";
import "bulma/css/bulma.css";
import "../globals.css";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Funds = () => {
  const [normalState, setNormalState] = useState<number | undefined>();
  const [extraState, setExtraState] = useState<number | undefined>();
  const [normalChange, setNormalChange] = useState<number | undefined>();
  const [extraChange, setExtraChange] = useState<number | undefined>();
  const [initState, setInitState] = useState(true);

  const getData = () => {
    return new Promise((r) => {
      const fundDataRef = ref(db, "/funds");
      onValue(fundDataRef, (snapshot) => {
        setNormalState(snapshot.val().normal);
        setExtraState(snapshot.val().extra);
      });
    })
    setInitState(false);
  };

  useEffect (() => {
    const initData = async () => {
      await getData();
    }
    initData();
  }, [initState])

  const changeStandard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNormalChange(Number(e.target.value));
  };

  const changeExtra = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraChange(Number(e.target.value));
  };

  const submitFunds = () => {
    let funds = { normal: normalChange, extra: extraChange };
    setNormalState(undefined);
    setExtraState(undefined);
    const dbRef = ref(db, "/funds");
    set(dbRef, funds);
    setInitState(true);
  };

  const clearExpenses = () => {
    const dbRef = ref(db, "/week");
    set(dbRef, []);
  };

  return (
    <main className="has-background-primary-dark vh-100">
      <article className="form-wrapper">
        <section className="field">
          <label className="label">Standard funds: ${normalState}</label>
          <div className="control">
            <input
              className="input"
              type="number"
              placeholder="$500"
              onChange={changeStandard}
            />
          </div>
        </section>

        <section className="field">
          <label className="label">Extra Funds: ${extraState}</label>
          <div className="control">
            <input
              className="input"
              type="number"
              onChange={changeExtra}
            />
          </div>
        </section>

        {normalChange !== undefined && extraChange !== undefined && <section className="control">
          <div className="button is-primary" onClick={() => submitFunds()}>
            Submit
          </div>
        </section>}
        <hr></hr>

        <section className="control">
          <div className="button is-secondary" onClick={() => clearExpenses()}>
            Clear expenses
          </div>
        </section>
      </article>
    </main>
  );
};

export default Funds;
