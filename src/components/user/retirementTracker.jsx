import React, { useState } from "react";
import Sidebar from "../sidebar/sidebar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RetirementTrackerPage = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState(65); // Default retirement age
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);

  const calculateReadiness = () => {
    const years = retirementAge - currentAge;
    const monthlyReturn = (annualReturn / 100) / 12;
    let savings = parseFloat(currentSavings);
    const contributions = parseFloat(monthlySavings);
    const yearlyData = [];

    for (let i = 1; i <= years * 12; i++) {
      savings += contributions;
      savings += savings * monthlyReturn;
      if (i % 12 === 0) {
        const ageAtYear = parseFloat(currentAge) + i / 12;  // Correctly calculate age
        yearlyData.push({ year: ageAtYear, savings });
      }
    }

    setResult(`Estimated Savings at Retirement: $${savings.toFixed(2)}`);
    setChartData({
      labels: yearlyData.map((data) => data.year.toFixed(1)),  // Ensure age shows up in 1 decimal place
      datasets: [
        {
          label: "Savings Over Time",
          data: yearlyData.map((data) => data.savings),
          backgroundColor: "rgba(78, 159, 96, 0.4)",
          borderColor: "#4E9F60",
          borderWidth: 2,
          fill: true, // Filling the area under the line
        },
      ],
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Retirement Tracker</h1>
        <p className="mb-4 text-lg">
          Enter your details to see if you're on track to retire at age {retirementAge}.
        </p>
        <div className="grid gap-4 grid-cols-2">
          <div>
            <label htmlFor="currentAge" className="font-semibold">
              Current Age:
            </label>
            <input
              type="number"
              id="currentAge"
              className="w-full p-2 border rounded mt-2"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="retirementAge" className="font-semibold">
              Retirement Age (default 65):
            </label>
            <input
              type="number"
              id="retirementAge"
              className="w-full p-2 border rounded mt-2"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="currentSavings" className="font-semibold">
              Current Savings:
            </label>
            <input
              type="number"
              id="currentSavings"
              className="w-full p-2 border rounded mt-2"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="monthlySavings" className="font-semibold">
              Monthly Savings:
            </label>
            <input
              type="number"
              id="monthlySavings"
              className="w-full p-2 border rounded mt-2"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="annualReturn" className="font-semibold">
              Expected Annual Return (%):
            </label>
            <input
              type="number"
              id="annualReturn"
              className="w-full p-2 border rounded mt-2"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={calculateReadiness}
          className="mt-6 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800"
        >
          Calculate Readiness
        </button>
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">{result}</h2>
            {chartData && (
              <div>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Age (Years)",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Savings ($)",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementTrackerPage;

