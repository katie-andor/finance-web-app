import React, { useState, useEffect } from "react";
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
  updateDoc,
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

  const colors = ["#C7CB85", "#E7A977", "#EBBE9B", "#EBBE9B"];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

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

  useEffect(() => {
    const fetchBudgets = async () => {
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
          color: getRandomColor(), 
        }));
        setBudgets(budgetsData);
      } catch (error) {
        console.error("Error fetching budgets: ", error);
      }
    };

    fetchBudgets();
  }, [userId]);

  const handleAddBudget = async () => {
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

    
      const newBudgetData = {
        ...newBudget,
        id: docRef.id,
        color: getRandomColor(), 
      };

      setBudgets((prevBudgets) => [...prevBudgets, newBudgetData]);

      setNewBudget({ title: "", amount: 0, items: [], category: "" });
      setShowModal(false);
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

  const handleRemoveItem = async (budgetId, itemIndex) => {
    try {
      // Remove the item from the local state
      const updatedItems = budgets
        .find(budget => budget.id === budgetId)
        .items.filter((_, index) => index !== itemIndex);
  
      const updatedBudget = {
        ...budgets.find(budget => budget.id === budgetId),
        items: updatedItems,
      };
  

      const budgetDocRef = doc(db, "users", userId, "budgets", budgetId);
      await updateDoc(budgetDocRef, {
        items: updatedItems,
      });
  
     
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget.id === budgetId ? updatedBudget : budget
        )
      );
    } catch (error) {
      console.error("Error removing item from budget: ", error);
    }
  };
  

  const handleDeleteBudget = async (budgetId) => {
    try {
      const budgetDocRef = doc(db, "users", userId, "budgets", budgetId);
      await deleteDoc(budgetDocRef);
      console.log(`Budget with ID: ${budgetId} deleted`);

    
      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.id !== budgetId)
      );
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
                <div
                  className="flex flex-row justify-between items-center border-b-2 border-black rounded-tr-xl rounded-tl-xl h-[60px] w-full"
                  style={{ backgroundColor: budget.color }} 
                >
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
      onClick={() => handleRemoveItem(budget.id, index)} 
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
                      style={{
                        backgroundColor: budget.color, 
                        width: `${progress}%`,
                      }}
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
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
              <h2>Add Budget</h2>
              <div>
                <label className="block font-semibold">Title:</label>
                <input
                  type="text"
                  value={newBudget.title}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, title: e.target.value })
                  }
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold">Amount:</label>
                <input
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, amount: e.target.value })
                  }
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold">Category:</label>
                <select
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Fun">Fun</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold">Item Name:</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold">Item Cost:</label>
                <input
                  type="number"
                  value={newItem.cost}
                  onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) })}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mt-4"
                onClick={handleAddItem}
              >
                Add Item
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 ml-4"
                onClick={handleAddBudget}
              >
                Save Budget
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 ml-4"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
