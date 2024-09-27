"use client";

import React, { useState, useEffect } from "react";
import Expense from "./types/expense";
import ExpenseModal from "./expenseModal/expenseModal";
import "bulma/css/bulma.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { voidExpense, firebaseConfig } from "./utils/utils";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Home = () => {
  const [week, setWeek] = useState<Expense[] | []>([]);
  const [dateState, setDateState] = useState<number>();
  const [modalState, setModalState] = useState("modal");
  const [normalSpentState, setNormalSpent] = useState(0);
  const [extraSpentState, setExtraSpent] = useState(0);
  const [budgetState, setBudgetState] = useState(0);
  const [extraState, setExtraState] = useState(0);
  const [expenseState, setExpenseState] = useState<Expense>(voidExpense);
  const [init, setInit] = useState(true);
  const [normalSpend, setNormalSpend] = useState(true);
  const [deleteState, setDeleteState] = useState(false);

  const postData = async (data: Expense[], path: string) => {
    const dbRef = ref(db, path);
    set(dbRef, data);
    setTimeout(() => setInit(true), 3000);
  };

  const getData = async (): Promise<Expense[]> => {
    return new Promise((r) => {
      const weekDataRef = ref(db, "/week");
      onValue(weekDataRef, (snapshot) => {
        setWeek(snapshot.val());
      });

      const fundsDataRef = ref(db, "/funds");
      onValue(fundsDataRef, (snapshot) => {
        setBudgetState(snapshot.val().normal);
        setExtraState(snapshot.val().extra);
      });
    });
  };

  const calculate = () => {
    let normal: Expense[] = [];
    let extra: Expense[] = [];
    week.filter((e) => e.normal).forEach((e) => normal.push(e));
    week.filter((e) => !e.normal).forEach((e) => extra.push(e));
    setNormalSpent(normal.reduce((parSum, a) => parSum + a.spent, 0));
    setExtraSpent(extra.reduce((parSum, a) => parSum + a.spent, 0));
    setDeleteState(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Array.isArray(week) && week.length > 0) {
        calculate();
      } else {
        setNormalSpent(0);
        setExtraSpent(0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [week]);

  useEffect(() => {
    const initData = async () => {
      const response = await getData();
    };
    initData();
    getDateOfWednesday();
    setInit(false);
  }, [expenseState, init, deleteState]);

  const getDateOfWednesday = () => {
    let day = new Date();
    let lastWedDate;
    switch (day.getDay()) {
      case 0:
        lastWedDate = 4;
        break;
      case 1:
        lastWedDate = 5;
        break;
      case 2:
        lastWedDate = 6;
        break;
      case 3:
        lastWedDate = 0;
        break;
      case 4:
        lastWedDate = 1;
        break;
      case 5:
        lastWedDate = 2;
        break;
      case 6:
        lastWedDate = 3;
      default:
        lastWedDate = 0;
    }
    let lastWed = new Date().getDate() - lastWedDate;
    setDateState(lastWed);
  };

  const addClicked = () => {
    setNormalSpend(true);
    if (modalState === "modal") setModalState("modal is-active");
    else setModalState("modal");
  };

  const uniqueKey = () => {
    let newKey = week.length;
    while (week.some((exp) => exp.key === newKey)) {
      newKey++;
    }
    return newKey;
  };

  const submitExpense = () => {
    if (
      expenseState.spent !== 0 &&
      expenseState.item !== "" &&
      expenseState.vendor !== ""
    ) {
      let newExpense = expenseState;
      let newKey = 0;
      if (Array.isArray(week)) newKey = uniqueKey();
      newExpense.key = newKey;
      const data = [];
      if (Array.isArray(week)) data.push(...week, newExpense);
      else data.push(newExpense);
      setModalState("modal");
      setExpenseState(voidExpense);
      postData(data, "/week");
    }
  };

  const deleteClicked = (key: Number | undefined) => {
    setDeleteState(true);
    let arr = week;
    const data = arr.filter((exp) => exp.key !== key);
    postData(data, "/week");
  };

  return (
    <main className="body container">
      <ExpenseModal
        clicked={() => addClicked()}
        modalState={modalState}
        submitExpense={() => submitExpense()}
        expenseState={expenseState}
        setExpense={setExpenseState}
        normalSpend={normalSpend}
        setNormalSpend={setNormalSpend}
      />
      <article className="Hero is-info">
        <section className="hero-body">
          <h2 className="title has-text-black-ter">
            Total spent since last Wednesday the {dateState}:
          </h2>
          <h3 className="subtitle has-text-black-ter">
            ${Number(normalSpentState + extraSpentState).toFixed(2)}
          </h3>
          <h1 className="title has-text-black-ter">Weekly budget remaining:</h1>
          <h3 className="subtitle has-text-black-ter">
            $
            {budgetState - normalSpentState > 0 &&
            extraState - extraSpentState > 0
              ? Number(budgetState - normalSpentState).toFixed(2)
              : Number(budgetState -
                (normalSpentState + (extraSpentState - extraState))).toFixed(2)}
          </h3>
          {extraState !== 0 && (
            <React.Fragment>
              <h1 className="title has-text-black-ter">
                Extra money this week:
              </h1>
              <h3 className="subtitle has-text-black-ter">
                $
                {extraState - extraSpentState > 0
                  ? Number(extraState - extraSpentState).toFixed(2)
                  : 0}
              </h3>
            </React.Fragment>
          )}
        </section>
      </article>
      <br></br>
      <article className="container">
        <div className="box has-background-primary">
          <section className="columns">
            {/* <div
              className="column is-2 button is-warning is-small"
              onClick={() => lastWeekClicked()}
            >
              See last week
            </div>
            <hr></hr> */}
            <div
              className="column is-2 button is-warning"
              onClick={() => addClicked()}
            >
              Add expense
            </div>
          </section>
        </div>
      </article>

      <br></br>
      <article className="box has-background-primary table-container">
        <table className="table has-background-primary">
          <thead>
            <tr>
              <th>Price</th>
              <th>Item</th>
              <th>Vendor</th>
              <th>Category</th>
              <th>{""}</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>Price</th>
              <th>Item</th>
              <th>Vendor</th>
              <th>Category</th>
              <th>{""}</th>
            </tr>
          </tfoot>
          <tbody>
            {Array.isArray(week) &&
              week.map((e) => (
                <tr key={e.key}>
                  <th>${Number(e.spent).toFixed(2)}</th>
                  <td>{e.item}</td>
                  <td>{e.vendor}</td>
                  <td>{e.normal ? "Normal" : "Extra"}</td>
                  <td
                    onClick={() => deleteClicked(e.key)}
                    className="delete is-large"
                    aria-label="close"
                  ></td>
                </tr>
              ))}
          </tbody>
        </table>
      </article>
    </main>
  );
};

export default Home;
