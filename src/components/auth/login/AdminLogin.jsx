import React, { useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";

const AdminLogin = () => {
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const db = getFirestore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);

      const adminDocRef = doc(db, "admins", email);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        setUserLoggedIn(true);
      } else {
        toast.error("You are not authorized to access the admin panel.");
        setIsSigningIn(false);
        return;
      }
    } catch (error) {
      toast.error("Error during sign-in: " + error.message);
      setIsSigningIn(false);
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold">Admin Login</h1>
        <form onSubmit={(e) => e.preventDefault()} className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="block w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
          <button
            onClick={handleSignIn}
            className="w-full mt-4 p-2 bg-blue-600 text-white rounded"
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
