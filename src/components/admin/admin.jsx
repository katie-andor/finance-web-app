import React from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../../firebase/auth";

const Admin = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/admin/login");
    } catch (error) {
      console.error("Error during sign-out: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="w-full mt-4 p-2 bg-red-600 text-white rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Admin;
