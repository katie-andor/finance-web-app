import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { FaDollarSign, FaBriefcase, FaUniversity } from "react-icons/fa"; // Importing icons


Chart.register(ArcElement, Tooltip, Legend);


const IncomePage = () => {
 const [incomeList, setIncomeList] = useState([]);
 const [newIncome, setNewIncome] = useState({
   source: "",
   amount: "",
   category: "Salary",
 });
 const [searchTerm, setSearchTerm] = useState("");
 const [incomeGoal, setIncomeGoal] = useState(5000);
 const categories = [
   { name: "Salary", color: "#4CAF50", icon: <FaDollarSign /> },
   { name: "Freelance", color: "#FFC107", icon: <FaBriefcase /> },
   { name: "Investments", color: "#03A9F4", icon: <FaUniversity /> },
 ];


 useEffect(() => {
   const savedIncomeList = JSON.parse(localStorage.getItem("incomeList"));
   const savedIncomeGoal = localStorage.getItem("incomeGoal");
   if (savedIncomeList) {
     setIncomeList(savedIncomeList);
   }
   if (savedIncomeGoal) {
     setIncomeGoal(savedIncomeGoal);
   }
 }, []);


 useEffect(() => {
   localStorage.setItem("incomeList", JSON.stringify(incomeList));
   localStorage.setItem("incomeGoal", incomeGoal);
 }, [incomeList, incomeGoal]);


 const totalIncome = incomeList.reduce((acc, item) => acc + Number(item.amount), 0);
 const progress = Math.min((totalIncome / incomeGoal) * 100, 100);


 const filteredIncomeList = incomeList.filter((income) =>
   income.source.toLowerCase().includes(searchTerm.toLowerCase())
 );


 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setNewIncome({ ...newIncome, [name]: value });
 };


 const handleAddIncome = () => {
   const newEntry = {
     ...newIncome,
     id: Date.now(),
     amount: parseFloat(newIncome.amount),
   };
   setIncomeList([...incomeList, newEntry]);
   setNewIncome({ source: "", amount: "", category: "Salary" });
 };


 const handleDeleteIncome = (id) => {
   setIncomeList(incomeList.filter((income) => income.id !== id));
 };


 const handleGoalChange = (e) => {
   const newGoal = e.target.value;
   setIncomeGoal(newGoal);
 };


 const incomeData = {
   labels: categories.map((cat) => cat.name),
   datasets: [
     {
       data: categories.map(
         (cat) =>
           incomeList
             .filter((income) => income.category === cat.name)
             .reduce((sum, income) => sum + income.amount, 0)
       ),
       backgroundColor: categories.map((cat) => cat.color),
     },
   ],
 };


 const chartOptions = {
   responsive: true,
   maintainAspectRatio: true,
   plugins: {
     legend: {
       position: "bottom",
       labels: {
         font: {
           size: 14,
           weight: "bold",
         },
       },
     },
     tooltip: {
       callbacks: {
         label: (context) => `$${context.raw.toFixed(2)}`,
       },
     },
   },
 };


 return (
   <div className="flex">
     <Sidebar />
     <div className="flex flex-col w-full p-4 font-montserrat">
       <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Income Page</h1>


       
       <div className="flex flex-col items-center mb-6">
         <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-2xl p-4 rounded-lg shadow-md">
           Total Income: ${totalIncome.toFixed(2)}
         </div>
         <div className="relative pt-2 w-3/4 mt-4">
           <motion.div
             style={{ width: `${progress}%` }}
             className="bg-gradient-to-r from-blue-500 to-green-500 text-center text-white text-sm rounded transition duration-500"
             animate={{ width: `${progress}%` }}
           >
             {progress.toFixed(1)}%
           </motion.div>
           <p className="text-center mt-2 text-gray-600">
             ${totalIncome.toFixed(2)} of ${incomeGoal} goal
           </p>
         </div>
       </div>


       
       <div className="flex justify-between items-center mb-6">
         <div className="text-lg font-semibold">Set Your Income Goal:</div>
         <input
           type="number"
           value={incomeGoal}
           onChange={handleGoalChange}
           className="border rounded p-2 w-1/4 text-lg"
           placeholder="Enter Goal"
         />
       </div>


       
       <input
         type="text"
         placeholder="Search Income Sources"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="border rounded w-full p-2 mb-4 text-lg"
       />


       
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         {filteredIncomeList.map((income) => (
           <motion.div
             key={income.id}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             transition={{ duration: 0.3 }}
             className="p-4 border rounded-lg shadow-lg"
             style={{
               backgroundColor:
                 categories.find((cat) => cat.name === income.category)?.color || "#fff",
             }}
           >
             <div className="flex justify-between items-center">
               <div className="flex items-center">
                 {categories.find((cat) => cat.name === income.category)?.icon}
                 <h2 className="ml-2 text-xl font-semibold">{income.source}</h2>
               </div>
               <button
                 onClick={() => handleDeleteIncome(income.id)}
                 className="text-red-500 text-xl hover:text-red-700 transition duration-300"
               >
                 X
               </button>
             </div>
             <p className="text-lg mt-2">${income.amount.toFixed(2)}</p>
             <p className="text-sm italic text-gray-600">{income.category}</p>
           </motion.div>
         ))}
       </div>


       
       <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
         <h2 className="text-xl font-bold mb-4">Add Income</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
           <input
             type="text"
             name="source"
             placeholder="Source"
             value={newIncome.source}
             onChange={handleInputChange}
             className="border rounded p-2"
           />
           <input
             type="number"
             name="amount"
             placeholder="Amount"
             value={newIncome.amount}
             onChange={handleInputChange}
             className="border rounded p-2"
           />
           <select
             name="category"
             value={newIncome.category}
             onChange={handleInputChange}
             className="border rounded p-2"
           >
             {categories.map((cat) => (
               <option key={cat.name} value={cat.name}>
                 {cat.name}
               </option>
             ))}
           </select>
         </div>
         <button
           onClick={handleAddIncome}
           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
         >
           Add Income
         </button>
       </div>


       
       <div className="mt-6">
         <h2 className="text-xl font-bold mb-4">Income Breakdown</h2>
         <div style={{ maxWidth: "300px", maxHeight: "300px", margin: "0 auto" }}>
           <Doughnut data={incomeData} options={chartOptions} />
         </div>
       </div>
     </div>
   </div>
 );
};


export default IncomePage;