import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const Admin = () => {
  const [statistics, setStatistics] = useState({
    topNotifications: [],
    topIncome: [],
  });
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const userStats = [];

        for (const userDoc of userDocs.docs) {
          const userId = userDoc.id;
          const notificationsCollection = collection(
            db,
            `users/${userId}/notifications`
          );
          const notificationsSnapshot = await getDocs(notificationsCollection);
          const notificationsCount = notificationsSnapshot.size;

          // Fetch income
          const incomeCollection = collection(db, `users/${userId}/income`);
          const incomeSnapshot = await getDocs(incomeCollection);
          let totalIncome = 0;
          incomeSnapshot.forEach((doc) => {
            totalIncome += doc.data().amount || 0; 
          });

          userStats.push({
            email: userDoc.data().email, 
            notificationsCount,
            totalIncome,
          });
        }

        if (userStats.length > 0) {
          const topNotifications = userStats
            .sort((a, b) => b.notificationsCount - a.notificationsCount)
            .slice(0, 3);

          const topIncome = userStats
            .sort((a, b) => b.totalIncome - a.totalIncome)
            .slice(0, 3);

          setStatistics({
            topNotifications,
            topIncome,
          });
        } else {
          console.log("No users with notifications or income found.");
          setStatistics({ topNotifications: [], topIncome: [] });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user statistics: ", error);
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, [db]);

  const notificationsData = {
    labels: statistics.topNotifications.map((user) => user.email),
    datasets: [
      {
        label: "Notifications",
        data: statistics.topNotifications.map(
          (user) => user.notificationsCount
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], 
      },
    ],
  };

  const incomeData = {
    labels: statistics.topIncome.map((user) => user.email),
    datasets: [
      {
        label: "Income",
        data: statistics.topIncome.map((user) => user.totalIncome),
        backgroundColor: ["#4BC0C0", "#FF9F40", "#FFCD56"],
      },
    ],
  };

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  return (
    <div className="grid grid-cols-2 text-center justify-items-center">
      <div>
        <h1>Top 3 Users with the Most Notifications</h1>
        <div className="h-[300px]">
          {statistics.topNotifications.length > 0 ? (
            <>
              <Pie data={notificationsData} />
              <ul>
                {statistics.topNotifications.map((user, index) => (
                  <li key={index}>
                    <strong>
                      {index + 1}. {user.email}
                    </strong>{" "}
                    - {user.notificationsCount} notifications
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      </div>
      <div>
        <h1>Top 3 Users with the Most Income</h1>
        <div className="h-[300px]">
          {statistics.topIncome.length > 0 ? (
            <>
              <Pie data={incomeData} />
              <ul>
                {statistics.topIncome.map((user, index) => (
                  <li key={index}>
                    <strong>
                      {index + 1}. {user.email}
                    </strong>{" "}
                    - ${user.totalIncome.toFixed(2)} income
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No income data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
