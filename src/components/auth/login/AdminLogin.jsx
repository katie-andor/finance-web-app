import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

const AdminLogin = () => {
    const { userLoggedIn } = useAuth();
    const db = getFirestore();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    const onSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
  
      if (!isSigningIn) {
        setIsSigningIn(true);
        try {
          const userCredential = await doSignInWithEmailAndPassword(email, password);
          const userEmail = userCredential.user.email;
          const adminDocRef = doc(db, "admins", userEmail);
          const adminDocSnap = await getDoc(adminDocRef);
  
          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data();
            
            if (adminData.isAdmin) {
              toast.success("Admin login successful!", { autoClose: 2000 });
              return <Navigate to="/admin/dashboard" replace />;
            } else {
              setErrorMessage("You are not authorized as an admin.");
              toast.error("You are not authorized as an admin.", { autoClose: 2000 });
            }
          } else {
            setErrorMessage("No admin found with this email.");
            toast.error("No admin found with this email.", { autoClose: 2000 });
          }
        } catch (error) {
          setErrorMessage("Invalid admin credentials");
          toast.error("Invalid admin credentials", { autoClose: 2000 });
        } finally {
          setIsSigningIn(false);
        }
      }
    };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/admin/dashboard"} replace={true} />}

      <main className="min-h-screen flex flex-row flex-wrap justify-around items-center">
        <div>
          <h1 className="font-montserrat font-extrabold text-[72px]">
            Admin Access
            <br />
            Secure <span className="text-[#7EA172]">Login</span>{" "}
            <CurrencyDollarIcon className="inline" width={70} />
          </h1>
        </div>
        <div className="w-[500px] h-[600px] bg-[#7EA172] space-y-5 p-4 filter drop-shadow-[-8px_4px_10px_rgba(0,0,0,0.55)]">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="font-montserrat font-semibold text-[40px] text-black">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-black bg-white outline-none"
              />
            </div>

            <div>
              <label className="font-montserrat font-semibold text-[40px] text-black">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 mb-6 px-3 py-2 text-black bg-white outline-none"
              />
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white text-[30px] rounded-lg font-montserrat font-semibold ${
                isSigningIn
                  ? "bg-[#502419] cursor-not-allowed"
                  : "bg-[#502419] hover:bg-[#2b140f] hover:shadow-xl transition duration-300"
              }`}
            >
              {isSigningIn ? "Signing In..." : "Admin Sign In"}
            </button>
          </form>
          <p className="text-center text-[22px] text-white font-montserrat font-semibold">
            Not an admin?{" "}
            <Link to={"/login"} className="underline">
              User Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
