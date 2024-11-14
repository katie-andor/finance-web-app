import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userLoggedIn } = useAuth();

  return (
    <nav className="w-full top-0 left-0 h-20 bg-[#7EA172] flex items-center justify-between p-2">
      <div className="font-montserrat font-bold text-[22px] ">
        Hello{", "}
        {currentUser.displayName ? currentUser.displayName : currentUser.email}
      </div>
      {userLoggedIn ? (
        <>
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="font-montserrat font-semibold text-[22px] text-black hover:underline bg-white rounded-xl p-2 pl-4 pr-4"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            className="font-montserrat font-semibold text-[22px] text-blue-600 underline"
            to={"/login"}
          >
            Login
          </Link>
          <Link
            className="font-montserrat font-semibold text-[22px] text-blue-600 underline"
            to={"/register"}
          >
            Register New Account
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;
