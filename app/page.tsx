"use client";

import React, { useState, useEffect } from "react";
import Expense from "./types/expense";
import ExpenseModal from "./expenseModal/expenseModal";
import "bulma/css/bulma.css";

const Home = () => {
  const voidExpense = {
    key: undefined,
    spent: 0,
    item: '',
    vendor: ''
  };
  const [week, setWeek] = useState<Expense[] | []>([]);
  const [dateState, setDateState] = useState<number>();
  const [modalState, setModalState] = useState("modal");
  const [spentState, setSpentState] = useState(0);
  const [budgetState, setBudgetState] = useState(500);
  const [extraState, setExtraState] = useState(200);
  const [expenseState, setExpenseState] = useState<Expense>(voidExpense);
  const [init, setInit] = useState(true);

  const initWeek = () => {
    const arr: Expense[] = [];
    const expense1: Expense = {
      key: 0,
      item: "the best item",
      vendor: "a good vendor",
      spent: 3.5,
    };
    const expense2: Expense = {
      key: 1,
      item: "an item",
      vendor: "a vendor",
      spent: 13.5,
    };
    const expense3: Expense = {
      key: 2,
      item: "a mediocre item",
      vendor: "a decent vendor",
      spent: 3.75,
    };
    arr.push(expense1, expense2, expense3);
    setWeek([...arr]);
    setInit(false);
  }

  const getData = () => {
    //TODO implement when firebase is setup
  }

  const postData = async () => {
    const response = await fetch('https://postman-echo.com/post', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(week)
      }).then(res => res.json());
      console.log(response);
  }

  useEffect(() => {
    getDateOfWednesday();
    if (init)
      initWeek();
    setSpentState(week.reduce((parSum, a) => parSum + a.spent, 0));
   }, [expenseState, init]);

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

  const buttonClicked = () => {
    console.log("clicked");
  };

  const addClicked = () => {
    if (modalState === "modal") setModalState("modal is-active");
    else setModalState("modal");
  };

  const uniqueKey = () => {
    let newKey = week.length;
    
    while (week.some(exp => exp.key === newKey)) {
      newKey++;
    }

    return newKey;
  }

  const submitExpense = () => {
    let newExpense = expenseState;
    let newKey = uniqueKey();
    newExpense.key = newKey;
    console.log(newExpense);
    setWeek([...week, newExpense]);
    setModalState("modal");
    setExpenseState(voidExpense);
    postData();
  };

  const deleteClicked = (key: Number)  => {
    let arr = week;
    // console.log(key);
    setWeek(arr.filter(exp => exp.key !== key));
  }

  return (
    <main className="body container">
      <ExpenseModal
        clicked={() => addClicked()}
        modalState={modalState}
        submitExpense={() => submitExpense()}
        expenseState={expenseState}
        setExpense={setExpenseState}
      />
      <article className="Hero is-info">
        <section className="hero-body">
          <h2 className="title has-text-black-ter">
            Total spent since last Wednesday the {dateState}:
          </h2>
          <h3 className="subtitle has-text-black-ter">${spentState}</h3>
          <h1 className="title has-text-black-ter">Weekly budget remaining:</h1>
          <h3 className="subtitle has-text-black-ter">
            ${extraState - spentState > 0 ? budgetState : budgetState - (spentState - extraState)}
          </h3>
          {extraState !== 0 && (
            <React.Fragment>
              <h1 className="title has-text-black-ter">
                Extra money this week:
              </h1>
              <h3 className="subtitle has-text-black-ter">${extraState - spentState > 0 ? extraState - spentState : 0}</h3>
            </React.Fragment>
          )}
        </section>
      </article>
      <br></br>
      <article className="container">
        <div className="box has-background-primary">
          <section className="columns">
            <div
              className="column is-2 button is-warning is-small"
              onClick={() => buttonClicked()}
            >
              See last week
            </div>
            <hr></hr>
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
      <article className="box has-background-primary">
        <table className="table has-background-primary">
          <thead>
            <tr>
              <th>Price</th>
              <th>Item</th>
              <th>Vendor</th>
              <th></th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>Price</th>
              <th>Item</th>
              <th>Vendor</th>
              <th></th>
            </tr>
          </tfoot>
          <tbody>
            {week.map((e) => (
              <tr key={e.key}>
                <th>${e.spent.toFixed(2)}</th>
                <td>{e.item}</td>
                <td>{e.vendor}</td>
                <td onClick={() => deleteClicked(e.key)} className="modal-close is-large" aria-label="close"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </main>
  );
};

export default Home;
