import React from "react";
import { useAuth } from "../../contexts/authContext";
import Header from "../header";

const Home = () => {
  const { currentUser } = useAuth();
  return (
    <div>
        <Header />
      <div className="text-2xl font-bold pt-14">
        Hello{" "}
        {currentUser.displayName ? currentUser.displayName : currentUser.email},
        you are now logged in.
      </div>
    </div>
  );
};

export default Home;
