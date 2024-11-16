import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: "",
    recurringDay: "",
    text: "",
  });
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colors = ["#C7CB85", "#E7A977", "#AB8A78"];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      const notificationsRef = collection(db, "users", userId, "notifications");
      const q = query(notificationsRef);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedNotifications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          color: getRandomColor(),
        }));
        setNotifications(fetchedNotifications);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    if (notifications.length > 0) {
      const currentDay = new Date().getDate();

      notifications.forEach((notification) => {
        if (parseInt(notification.recurringDay, 10) === currentDay) {
          toast.info(`Reminder: ${notification.title} - ${notification.text}`, {
            autoClose: 3000,
          });
        }
      });
    }
  }, [notifications]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification({ ...newNotification, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const notificationsRef = collection(db, "users", userId, "notifications");
      const notificationData = {
        title: newNotification.title,
        text: newNotification.text,
        recurringDay: newNotification.recurringDay,
        color: getRandomColor(),
      };

      notificationData.date = newNotification.recurringDay;

      await addDoc(notificationsRef, notificationData);

      setIsModalOpen(false);
      setNewNotification({
        title: "",
        recurringDay: "",
        text: "",
      });
    } catch (error) {
      console.error("Error adding notification: ", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const notificationRef = doc(
        db,
        "users",
        userId,
        "notifications",
        notificationId
      );
      await deleteDoc(notificationRef);
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  const renderDate = (notification) => {
    return `Every ${notification.recurringDay} of the month`;
  };

  return (
    <div className="flex font-montserrat">
      <Sidebar />
      <div className="flex flex-col w-full mt-2 h-[625px] overflow-y-auto">
        <h1 className="ml-2 font-extrabold text-[60px]">Notifications</h1>
        <div className="flex flex-row">
          <h2 className="font-extrabold text-[40px] ml-2">
            Current Notifications
          </h2>
          <button>
            <PlusIcon
              onClick={() => setIsModalOpen(true)}
              className="ml-2"
              width={50}
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mr-2 mt-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border-2 border-black rounded-xl h-[300px]"
            >
              <div
                className="flex flex-row justify-between items-center border-b-2 border-black rounded-tr-xl rounded-tl-xl h-[60px]"
                style={{ backgroundColor: notification.color }}
              >
                <h2 className="m-2 font-extrabold text-[32px]">
                  {notification.title}
                </h2>
                <XMarkIcon
                  width={35}
                  className="mr-2 cursor-pointer"
                  onClick={() => handleDeleteNotification(notification.id)}
                />
              </div>
              <div className="flex flex-col mt-2">
                <h3 className="ml-2 font-extrabold text-[32px]">Recurring:</h3>
                <div className="flex flex-row">
                  <h3 className="ml-2 font-semibold text-[30px]">
                    {renderDate(notification)}
                  </h3>
                  <CalendarDaysIcon width={40} className="ml-2" />
                </div>
                <div className="border-2 border-black w-[95%] mr-auto ml-auto m-2 rounded-xl p-2 h-[100px]">
                  {notification.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
              <h2 className="font-extrabold text-2xl mb-4">
                Create New Notification
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="font-semibold text-lg" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newNotification.title}
                    onChange={handleInputChange}
                    className="border rounded-xl w-full p-2 mt-2"
                    placeholder="Enter notification title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="font-semibold text-lg"
                    htmlFor="recurringDay"
                  >
                    Recurring Day
                  </label>
                  <input
                    type="number"
                    id="recurringDay"
                    name="recurringDay"
                    value={newNotification.recurringDay}
                    onChange={handleInputChange}
                    className="border rounded-xl w-full p-2 mt-2"
                    placeholder="Enter day of the month (1-31)"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="font-semibold text-lg" htmlFor="text">
                    Text
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    value={newNotification.text}
                    onChange={handleInputChange}
                    className="border rounded-xl w-full p-2 mt-2"
                    placeholder="Enter notification text"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-xl p-2 mt-2"
                  >
                    Create Notification
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 text-white rounded-xl p-2 mt-2"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
