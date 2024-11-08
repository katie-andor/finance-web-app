import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await doCreateUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="min-h-screen flex flex-row flex-wrap justify-around items-center">
        <div>
          <h1 className="font-montserrat font-extrabold text-[72px]">
            Welcome!
            <br />
            Let’s Save <br />
            Some <span className="text-[#7EA172]">Money</span>{" "}
            <CurrencyDollarIcon className="inline" width={70} />
          </h1>
        </div>
        <div className="w-[500px] h-[600px] bg-[#7EA172] space-y-5 p-4 filter drop-shadow-[-8px_4px_10px_rgba(0,0,0,0.55)]">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="font-montserrat font-semibold text-[40px] text-black">Email</label>
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
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-black bg-white outline-none"
              />
            </div>

            <div>
              <label className="font-montserrat font-semibold text-[40px] text-black">
                Confirm Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                }}
                className="w-full mt-2 mb-6 px-3 py-2 text-black bg-white outline-none"
              />
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-white text-[30px] rounded-lg font-montserrat font-semibold ${
                isRegistering
                  ? "bg-[#502419] cursor-not-allowed"
                  : "bg-[#502419] hover:bg-[#2b140f] hover:shadow-xl transition duration-300"
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-center text-[22px] text-white font-montserrat font-semibold">
              Already have an account? {"   "}
              <Link
                to={"/login"}
                className="underline"
              >
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
