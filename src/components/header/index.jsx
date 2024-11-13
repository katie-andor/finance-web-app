import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userLoggedIn } = useAuth();

  return (
    <nav className="w-full top-0 left-0 h-20 bg-[#dd4423] flex items-center justify-between">
      <button>
        <XMarkIcon width={40} className="m-2" />
      </button>
      {userLoggedIn ? (
        <>
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="font-montserrat font-semibold text-[22px] text-blue-600 underline"
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
      <div className="font-montserrat font-semibold text-[22px]">
        Hello{", "}
        {currentUser.displayName ? currentUser.displayName : currentUser.email}
      </div>
    </nav>
  );
};

export default Header;
