import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../sidebar/sidebar";
import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { PlusIcon } from "@heroicons/react/24/solid";

//all modal stuff
const Modal = ({ isOpen, close, handleAddSubscription }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddSubscription(name, cost);
    setName("");
    setCost("");
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-end transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg w-[400px] mb-8 transition-transform duration-500 ease-out ${
          isOpen ? "transform translate-y-0" : "transform translate-y-[100%]"
        }`}
      >
        <h2 className="text-2xl mb-4">Add Subscription</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Subscription Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border-2 border-gray-400 rounded"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="p-2 border-2 border-gray-400 rounded"
          />
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="bg-[#7EA172] text-white px-4 py-2 rounded"
            >
              Add Subscription
            </button>
            <button
              type="button"
              onClick={close}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const auth = getAuth();

  //get UID
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

  const getUserCollectionRef = useMemo(() => {
    if (!userId) return null;
    return collection(db, "users", userId, "subscriptions");
  }, [userId]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!getUserCollectionRef) return;

      try {
        const q = query(getUserCollectionRef, orderBy("subscriptionID"));
        const querySnapshot = await getDocs(q);
        const subs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubscriptions(subs);
        calculateTotalCost(subs);
      } catch (error) {
        console.error("Error fetching subscriptions: ", error);
      }
    };

    fetchSubscriptions();
  }, [getUserCollectionRef]);

  const calculateTotalCost = (subs) => {
    const total = subs.reduce((acc, sub) => acc + parseFloat(sub.cost), 0);
    setTotalCost(total.toFixed(2));
  };

  //new subscription
  const handleAddSubscription = async (name, cost) => {
    if (!name || !cost) return alert("Please enter both name and cost");

    //colors array
    const colors = ["#40ABAA", "#4077AB", "#4041AB", "#7440AB", "#AB4077"];

    //random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newSubscription = {
      subscriptionID: subscriptions.length + 1,
      name,
      cost: parseFloat(cost),
      color: randomColor,
    };

    try {
      if (!getUserCollectionRef) return;

      const docRef = await addDoc(getUserCollectionRef, newSubscription);
      const addedSubscription = { id: docRef.id, ...newSubscription };
      setSubscriptions((prev) => [...prev, addedSubscription]);
      calculateTotalCost([...subscriptions, addedSubscription]);
      setModalOpen(false); // Close the modal after adding
    } catch (error) {
      console.error("Error adding subscription: ", error);
    }
  };

  //delete
  const handleDeleteSubscription = async (subscriptionId) => {
    try {
      if (!getUserCollectionRef) return;

      const subscriptionDocRef = doc(
        db,
        "users",
        userId,
        "subscriptions",
        subscriptionId
      );
      await deleteDoc(subscriptionDocRef);

      setSubscriptions((prevSubscriptions) =>
        prevSubscriptions.filter((sub) => sub.id !== subscriptionId)
      );
      calculateTotalCost(
        subscriptions.filter((sub) => sub.id !== subscriptionId)
      );
    } catch (error) {
      console.error("Error deleting subscription: ", error);
    }
  };

  //height scaling for divs
  const maxCost =
    subscriptions.length > 0
      ? Math.max(...subscriptions.map((sub) => sub.cost))
      : 1;

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-[83%]">
        <div className="m-2 font-montserrat text-[60px] font-extrabold flex flex-row justify-between items-baseline">
          <h1>Subscriptions</h1>

          <button>
            <PlusIcon
              onClick={() => setModalOpen(true)}
              className="ml-2"
              width={50}
            />
          </button>
          <div className="flex-grow"></div>
          <h2 className="text-[30px]">Total Cost: ${totalCost}</h2>
        </div>

        <div className="w-full flex flex-row h-[500px] overflow-x-auto">
          {subscriptions.map((sub, index) => (
            <div
              key={index}
              className="flex flex-col mb-6 mr-2 ml-2 font-montserrat"
            >
              <div className="flex-grow"></div>

              <div
                className="w-[140px] text-[32px] text-white text-center font-bold pt-4"
                style={{
                  height: `${(sub.cost / maxCost) * 100}%`,
                  backgroundColor: sub.color,
                  transition: "height 0.3s ease-in-out",
                }}
              >
                ${sub.cost}
              </div>
              <h2 className="text-center text-[32px]">{sub.name}</h2>

              <button
                onClick={() => handleDeleteSubscription(sub.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <Modal
          isOpen={modalOpen}
          close={() => setModalOpen(false)}
          handleAddSubscription={handleAddSubscription}
        />
      </div>
    </div>
  );
};

export default Subscriptions;
