"use client";

import Expense from "./types/expense";
import { useState, useEffect } from "react";
import "bulma/css/bulma.css";

const Home = () => {
  const [week, setWeek] = useState<Expense[] | []>([]);
  const [dateState, setDateState] = useState<number>();

  useEffect(() => {
    getDateOfWednesday();
    const arr: Expense[] = [];
    const expense1: Expense = {
      item: "the best item",
      vendor: "a good vendor",
      spent: 3.5,
    };
    const expense2: Expense = {
      item: "an item",
      vendor: "a vendor",
      spent: 13.5,
    };
    const expense3: Expense = {
      item: "a mediocre item",
      vendor: "a decent vendor",
      spent: 3.75,
    };
    arr.push(expense1, expense2, expense3);
    setWeek([...arr]);
  }, []);

  const getDateOfWednesday = () => {
    let day = new Date();
    console.log("day: " + day);
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
    }
    console.log(lastWedDate);
    let lastWed = new Date().getDate() - lastWedDate;
    setDateState(lastWed);
  };

  const buttonClicked = () => {
    console.log("clicked");
  };

  const addClicked = () => {
    console.log("add clicked");
  };

  const total = 2000;

  return (
    <main className="body container">
      <article className="Hero is-info">
        <section className="hero-body">
          <h1 className="title has-text-black-ter">
            Total spent since last Wednesday the {dateState}:
          </h1>
          <h2 className="subtitle has-text-black-ter">${total}</h2>
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
              <tr key={e.spent}>
                <th>${e.spent}</th>
                <td>{e.item}</td>
                <td>{e.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </main>
  );
};

export default Home;
