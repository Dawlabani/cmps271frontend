import React from "react";
import "../../DashboardTheme.css";

const transactions = [
  { id: 1, description: "Groceries", amount: "$50", sdgFriendly: true },
  { id: 2, description: "Electric Bill", amount: "$100", sdgFriendly: false },
  { id: 3, description: "Organic Market", amount: "$30", sdgFriendly: true },
];

const Transactions = () => {
  return (
    <div className="transactions-container">
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map((txn) => (
          <li key={txn.id} className={txn.sdgFriendly ? "sdg-yes" : "sdg-no"}>
            {txn.description} <span>{txn.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
