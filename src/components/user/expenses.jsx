import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import foodicon from "../../images/food_icon.svg";
import travelicon from "../../images/travel_icon.svg";
import funicon from "../../images/fun_icon.svg";
import billicon from "../../images/bill_icon.svg";
import { PlusIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline"; 
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  db,
  auth,
  collection,
  addDoc,
  query,
  deleteDoc,
  doc,
  onSnapshot,
} from "../../firebase/firebase"; 
import { onAuthStateChanged } from "firebase/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

const Modal = ({ isOpen, close, handleAddExpense }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Personal");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !category || !date || !amount) {
      alert("Please fill out all fields!");
      return;
    }

    handleAddExpense({ name, category, date, amount: parseFloat(amount) });
    setName("");
    setCategory("Personal");
    setDate("");
    setAmount("");
    close();
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center transition-all ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg font-montserrat">
        <h2 className="text-2xl mb-4 font-bold">Add Expense</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded"
          >
            <option value="Personal">Personal</option>
            <option value="Bills">Bills</option>
            <option value="Groceries">Groceries</option>
            <option value="Trips">Trips</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={close}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0); 
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      const expensesRef = collection(db, "users", userId, "expenses");
      const q = query(expensesRef);

      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedExpenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(fetchedExpenses);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleAddExpense = async (expense) => {
    if (!userId) return;

    try {
      const expensesRef = collection(db, "users", userId, "expenses");
      await addDoc(expensesRef, expense);
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!userId) return;

    try {
      const expenseRef = doc(db, "users", userId, "expenses", expenseId);
      await deleteDoc(expenseRef);
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netTotal = income - totalExpenses;

  const categoryTotals = expenses.reduce((totals, expense) => {
    if (!totals[expense.category]) {
      totals[expense.category] = 0;
    }
    totals[expense.category] += expense.amount;
    return totals;
  }, {});

  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: ["#AB8A78", "#7EA172", "#C7CB85", "#E7A977"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex font-montserrat h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-50 p-6">
        <header className="flex flex-row justify-between items-center mb-6">
          <div className="flex flex-row items-center">
            <h1 className="text-[60px] font-extrabold">Expenses</h1>
            <img src={foodicon} alt="Food Icon" width={80} className="ml-4" />
            <img src={travelicon} alt="Travel Icon" width={80} className="ml-4" />
            <img src={funicon} alt="Fun Icon" width={80} className="ml-4" />
            <img src={billicon} alt="Bill Icon" width={80} className="ml-4" />
          </div>

          <button
            className="text-black text-[36px] font-bold"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="h-10 w-10 text-black" />
          </button>
        </header>

        <div className="flex justify-between mb-6">
          <div className="text-red-600 font-bold text-[20px]">Expenses: -${totalExpenses.toFixed(2)}</div>
          <div className="text-green-600 font-bold text-[20px]">${income.toFixed(2)}</div>
          <div className="font-bold text-[20px]">Net Total: ${netTotal.toFixed(2)}</div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Expense Distribution</h2>
          {Object.keys(categoryTotals).length > 0 ? (
            <div className="w-[300px] h-[300px] mx-auto">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          ) : (
            <p className="text-center text-gray-500">No expenses to display.</p>
          )}
        </div>

        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center bg-white shadow-md rounded-md p-4"
            >
              <div>
                <h2 className="text-lg font-bold">{expense.name}</h2>
                <p className="text-gray-600">{expense.category}</p>
                <p className="text-gray-500">Posting Date: {expense.date}</p>
              </div>
              <div className="flex items-center">
                <div className="text-xl font-bold mr-4">${expense.amount.toFixed(2)}</div>
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        close={() => setModalOpen(false)}
        handleAddExpense={handleAddExpense}
      />
    </div>
  );
};

export default Expenses;
