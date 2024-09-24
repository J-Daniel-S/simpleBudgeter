"use client";

import React from "react";
import Expense from "../types/expense";

interface ExpenseModalProps {
  modalState: string;
  clicked: () => void;
  submitExpense: () => void;
  expenseState: Expense;
  setExpense: (expense: Expense) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = (props) => {
  const changePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cost = Number(e.target.value);
    let expense: Expense = { ...props.expenseState, spent: cost };
    props.setExpense(expense);
    console.log(props.expenseState);
  };

  const changeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    let expense: Expense = { ...props.expenseState, item: e.target.value };
    props.setExpense(expense);
    console.log(props.expenseState);
  };

  const changeVendor = (e: React.ChangeEvent<HTMLInputElement>) => {
    let expense: Expense = { ...props.expenseState, vendor: e.target.value };
    props.setExpense(expense);
    console.log(props.expenseState);
  };

  return (
    <main className={props.modalState}>
      <article className="modal-background">
        <section className="modal-content">
          <div className="field">
            <label className="label">Price</label>
            <div className="control">
              <input
                className="input"
                type="number"
                placeholder="$ a billion"
                value={props.expenseState.spent || ''}
                onChange={changePrice}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Item</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={props.expenseState.item || ''}
                onChange={changeItem}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Vendor</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={props.expenseState.vendor || '' }
                onChange={changeVendor}
              />
            </div>
          </div>
          <div className="control">
            <div
              className="button is-primary"
              onClick={() => props.submitExpense()}
            >
              Submit
            </div>
          </div>
        </section>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => props.clicked()}
        ></button>
      </article>
    </main>
  );
};

export default ExpenseModal;
