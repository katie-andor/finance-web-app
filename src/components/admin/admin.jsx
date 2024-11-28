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
    nonAdminCount: 0,
    popularCategories: { budgets: {}, income: {}, expenses: {} },
  });
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const userStats = [];
        let nonAdminCount = 0;
        const categoryCounts = { budgets: {}, income: {}, expenses: {} };

        for (const userDoc of userDocs.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();

          if (!userData.isAdmin) {
            nonAdminCount++;
          }

          const notificationsCollection = collection(
            db,
            `users/${userId}/notifications`
          );
          const notificationsSnapshot = await getDocs(notificationsCollection);
          const notificationsCount = notificationsSnapshot.size;

          const incomeCollection = collection(db, `users/${userId}/income`);
          const incomeSnapshot = await getDocs(incomeCollection);
          let totalIncome = 0;
          incomeSnapshot.forEach((doc) => {
            const { amount, category } = doc.data();
            totalIncome += amount || 0;
            if (category) {
              categoryCounts.income[category] =
                (categoryCounts.income[category] || 0) + 1;
            }
          });

          const budgetsCollection = collection(db, `users/${userId}/budgets`);
          const budgetsSnapshot = await getDocs(budgetsCollection);
          budgetsSnapshot.forEach((doc) => {
            const { category } = doc.data();
            if (category) {
              categoryCounts.budgets[category] =
                (categoryCounts.budgets[category] || 0) + 1;
            }
          });

          const expensesCollection = collection(db, `users/${userId}/expenses`);
          const expensesSnapshot = await getDocs(expensesCollection);
          expensesSnapshot.forEach((doc) => {
            const { category } = doc.data();
            if (category) {
              categoryCounts.expenses[category] =
                (categoryCounts.expenses[category] || 0) + 1;
            }
          });

          userStats.push({
            email: userData.email,
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
            nonAdminCount,
            popularCategories: categoryCounts,
          });
        } else {
          setStatistics({
            topNotifications: [],
            topIncome: [],
            nonAdminCount,
            popularCategories: categoryCounts,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user statistics: ", error);
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, [db]);

  const { popularCategories } = statistics;

  const generateCategoryData = (categoryCounts) => {
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    return {
      labels,
      datasets: [
        {
          label: "Categories",
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  return (
    <div className="w-[99%] h-[625px] overflow-y-auto font-montserrat m-2 font-extrabold text-[60px] flex flex-col">
      <h1>User Statistics Overview</h1>
      <div className="text-[40px] font-semibold">
        <h2>Total Non-Admin Users: {statistics.nonAdminCount}</h2>
      </div>
      <div className="grid grid-cols-2 mb-[200px]">
        {/* Notifications Section */}
        <div className="text-center">
          <h2 className="text-[35px] font-light">
            Top 3 Users with the Most Notifications
          </h2>
          <div className="h-[300px] text-[24px] font-light justify-items-center">
            {statistics.topNotifications.length > 0 ? (
              <>
                <Pie
                  data={{
                    labels: statistics.topNotifications.map((user) => user.email),
                    datasets: [
                      {
                        data: statistics.topNotifications.map(
                          (user) => user.notificationsCount
                        ),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      },
                    ],
                  }}
                />
                <ul className="mt-4">
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

        {/* Income Section */}
        <div className="text-center">
          <h2 className="text-[35px] font-light">
            Top 3 Users with the Most Income
          </h2>
          <div className="h-[300px] text-[24px] font-light justify-items-center">
            {statistics.topIncome.length > 0 ? (
              <>
                <Pie
                  data={{
                    labels: statistics.topIncome.map((user) => user.email),
                    datasets: [
                      {
                        data: statistics.topIncome.map((user) => user.totalIncome),
                        backgroundColor: ["#4BC0C0", "#FF9F40", "#FFCD56"],
                      },
                    ],
                  }}
                />
                <ul className="mt-4">
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
<div className="grid grid-cols-3">
  
          {/* Popular Budget Categories Section */}
          <div className="text-center">
            <h2 className="text-[35px] font-light">Popular Budget Categories</h2>
            <Pie className="h-[300px]" data={generateCategoryData(popularCategories.budgets)} />
          </div>
  
          {/* Popular Income Categories Section */}
          <div className="text-center">
            <h2 className="text-[35px] font-light">Popular Income Categories</h2>
            <Pie className="h-[300px]" data={generateCategoryData(popularCategories.income)} />
          </div>
  
          {/* Popular Expense Categories Section */}
          <div className="text-center">
            <h2 className="text-[35px] font-light">Popular Expense Categories</h2>
            <Pie className="h-[300px]" data={generateCategoryData(popularCategories.expenses)} />
          </div>
</div>
      </div>

  );
};

export default Admin;
