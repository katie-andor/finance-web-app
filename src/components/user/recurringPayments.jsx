import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import { motion } from "framer-motion";

const RecurringPaymentsPage = () => {
 const [paymentList, setPaymentList] = useState([]);
 const [newPayment, setNewPayment] = useState({
   source: "",
   amount: "",
   category: "Subscription",
   frequency: "Monthly",
 });
 const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
   const savedPayments = JSON.parse(localStorage.getItem("payments"));
   if (savedPayments) {
     setPaymentList(savedPayments);
   }
 }, []);

 useEffect(() => {
   localStorage.setItem("payments", JSON.stringify(paymentList));
 }, [paymentList]);

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setNewPayment({ ...newPayment, [name]: value });
 };

 const handleAddPayment = () => {
   if (!newPayment.source || !newPayment.amount) {
     alert("Please provide both source and amount.");
     return;
   }
   const newEntry = {
     ...newPayment,
     id: Date.now(),
     amount: parseFloat(newPayment.amount),
   };
   setPaymentList([...paymentList, newEntry]);
   setNewPayment({ source: "", amount: "", category: "Subscription", frequency: "Monthly" });
 };

 const handleDeletePayment = (id) => {
   setPaymentList(paymentList.filter((payment) => payment.id !== id));
 };

 const filteredPaymentList = paymentList.filter((payment) =>
   payment.source.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const formatCurrency = (amount) => {
   return amount.toFixed(2);
 };

 return (
   <div className="flex">
     <Sidebar />
     <div className="flex flex-col w-full p-4 font-montserrat">
       <h1 className="text-4xl font-bold mb-4">Recurring Payments</h1>

       <input
         type="text"
         placeholder="Search Payment Sources"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="border rounded w-full p-2 mb-4"
       />

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredPaymentList.map((payment) => (
           <motion.div
             key={payment.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="p-4 border rounded shadow-md bg-white"
           >
             <h2 className="text-xl font-bold">{payment.source}</h2>
             <p className="text-lg">Amount: ${formatCurrency(payment.amount)}</p>
             <p className="text-sm italic">Category: {payment.category}</p>
             <p className="text-sm italic">Frequency: {payment.frequency}</p>
             <button
               onClick={() => handleDeletePayment(payment.id)}
               className="mt-2 text-red-500 hover:text-red-700"
             >
               Delete
             </button>
           </motion.div>
         ))}
       </div>

       <div className="mt-6 p-4 border rounded shadow-md bg-white">
         <h2 className="text-xl font-bold mb-4">Add Recurring Payment</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <input
             type="text"
             name="source"
             placeholder="Source"
             value={newPayment.source}
             onChange={handleInputChange}
             className="border rounded p-2"
           />
           <input
             type="number"
             name="amount"
             placeholder="Amount"
             value={newPayment.amount}
             onChange={handleInputChange}
             className="border rounded p-2"
           />
           <select
             name="frequency"
             value={newPayment.frequency}
             onChange={handleInputChange}
             className="border rounded p-2"
           >
             <option value="Monthly">Monthly</option>
             <option value="Yearly">Yearly</option>
           </select>
         </div>
         <div className="mt-4">
           <select
             name="category"
             value={newPayment.category}
             onChange={handleInputChange}
             className="border rounded p-2"
           >
             <option value="Subscription">Subscription</option>
             <option value="Rent">Rent</option>
             <option value="Utilities">Utilities</option>
             <option value="Loan">Loan</option>
           </select>
         </div>
         <button
           onClick={handleAddPayment}
           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
         >
           Add Payment
         </button>
       </div>
     </div>
   </div>
 );
};

export default RecurringPaymentsPage;