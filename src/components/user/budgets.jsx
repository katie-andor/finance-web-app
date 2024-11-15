import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../sidebar/sidebar";
import foodicon from "../../images/food_icon.svg";
import travelicon from "../../images/travel_icon.svg";
import funicon from "../../images/fun_icon.svg";
import billicon from "../../images/bill_icon.svg";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    title: "",
    amount: 0,
    items: [],
    category: "",
  });
  const [newItem, setNewItem] = useState({
    name: "",
    cost: 0,
  });
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.error("No user signed in");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  //get budgets
  const fetchBudgets = useCallback(async () => {
    if (!userId) return;

    const getUserCollectionRef = () => {
      return collection(db, "users", userId, "budgets");
    };

    const userCollectionRef = getUserCollectionRef();

    try {
      const querySnapshot = await getDocs(userCollectionRef);
      const budgetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error fetching budgets: ", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchBudgets();
  }, [userId, fetchBudgets]);

  const handleAddBudget = async () => {
    console.log("newBudget before validation:", newBudget);

    if (
      !newBudget.title ||
      !newBudget.amount ||
      !newBudget.category ||
      newBudget.items.length === 0
    ) {
      alert("Please fill in all fields, including at least one item.");
      return;
    }

    try {
      const userCollectionRef = collection(db, "users", userId, "budgets");
      const docRef = await addDoc(userCollectionRef, newBudget);
      console.log("Budget added with ID: ", docRef.id);

      setNewBudget({ title: "", amount: 0, items: [], category: "" });
      setShowModal(false);

      fetchBudgets();
    } catch (error) {
      console.error("Error adding budget: ", error);
    }
  };

  const handleAddItem = () => {
    if (
      !newItem.name ||
      !newItem.cost ||
      isNaN(newItem.cost) ||
      newItem.cost <= 0
    ) {
      alert("Please provide a valid item name and cost.");
      return;
    }

    setNewBudget((prevState) => ({
      ...prevState,
      items: [...prevState.items, newItem],
    }));

    setNewItem({ name: "", cost: 0 });
  };

  const handleRemoveItem = (index) => {
    setNewBudget((prevState) => {
      const updatedItems = prevState.items.filter((item, i) => i !== index);
      return { ...prevState, items: updatedItems };
    });
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      const budgetDocRef = doc(db, "users", userId, "budgets", budgetId);
      await deleteDoc(budgetDocRef);
      console.log(`Budget with ID: ${budgetId} deleted`);

      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget: ", error);
    }
  };

  const calculateItemTotal = (items) => {
    return items.reduce((total, item) => total + item.cost, 0);
  };

  const calculateProgress = (totalAmount, currentAmount) => {
    return (currentAmount / totalAmount) * 100;
  };

  return (
    <div className="flex font-montserrat">
      <Sidebar />
      <div className="flex flex-col w-full h-[625px] overflow-y-auto">
        <div className="m-2 font-extrabold text-[60px] flex flex-row justify-start items-start">
          Budgets
          <img src={foodicon} alt="food icon" width={80} className="ml-2" />
          <img src={travelicon} alt="travel icon" width={80} className="ml-2" />
          <img src={funicon} alt="fun icon" width={80} className="ml-2" />
          <img src={billicon} alt="bill icon" width={80} className="ml-2" />
        </div>

        <button
          className="w-[150px] bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg m-4"
          onClick={() => setShowModal(true)}
        >
          Add Budget
        </button>

        <div className="grid grid-cols-2 gap-4 mr-2">
          {budgets.map((budget) => {
            const totalItemsCost = calculateItemTotal(budget.items);
            const progress = calculateProgress(budget.amount, totalItemsCost);

            return (
              <div
                key={budget.id}
                className="border-2 border-black rounded-xl h-[300px]"
              >
                <div className="flex flex-row justify-between items-center border-b-2 border-black rounded-tr-xl rounded-tl-xl h-[60px] bg-[#C7CB85] w-full">
                  <h2 className="m-2 font-extrabold text-[32px]">
                    {budget.title}
                  </h2>
                  <XMarkIcon
                    width={35}
                    className="mr-2 cursor-pointer"
                    onClick={() => handleDeleteBudget(budget.id)}
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <div className="flex flex-row">
                    <img
                      src={foodicon}
                      alt="food icon"
                      width={90}
                      className="m-4"
                    />
                    <div className="border-2 border-black w-full m-2 rounded-xl p-2">
                      Items:{" "}
                      {budget.items.map((item, index) => (
                        <div key={item.itemID}>
                          {item.name}: ${item.cost}
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="ml-2 text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between w-[90%] mr-auto ml-auto mt-4">
                    <h3 className="font-semibold text-[20px]">
                      ${totalItemsCost}
                    </h3>
                    <h3 className="font-semibold text-[20px]">
                      ${budget.amount}
                    </h3>
                  </div>
                  <div className="flex flex-row h-[30px] w-[90%] m-4 mt-2 mr-auto ml-auto">
                    <div
                      className="bg-[#C7CB85]"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div
                      className="bg-[#8F8F8F]"
                      style={{ width: `${100 - progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[500px]">
              <h2 className="text-xl font-bold mb-4">Add New Budget</h2>
              <div>
                <label className="block font-semibold">Title:</label>
                <input
                  type="text"
                  value={newBudget.title}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, title: e.target.value })
                  }
                  className="border w-full rounded-md p-2 mb-4"
                />
              </div>
              <div>
                <label className="block font-semibold">Category:</label>
                <select
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                  className="border w-full rounded-md p-2 mb-4"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Fun">Fun</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold">Amount:</label>
                <input
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="border w-full rounded-md p-2 mb-4"
                />
              </div>
              <div>
                <label className="block font-semibold">Items:</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="border w-full rounded-md p-2 mb-2"
                  placeholder="Item name"
                />
                <input
                  type="number"
                  value={newItem.cost}
                  onChange={(e) =>
                    setNewItem({ ...newItem, cost: parseFloat(e.target.value) })
                  }
                  className="border w-full rounded-md p-2 mb-4"
                  placeholder="Item cost"
                />
                <button
                  onClick={handleAddItem}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                >
                  Add Item
                </button>
                <div className="mt-4">
                  <button
                    onClick={handleAddBudget}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                  >
                    Save Budget
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
