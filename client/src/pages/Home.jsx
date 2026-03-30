import { useAuth } from "../hooks/useAuth.js";

const Home = () => {
  const { user } = useAuth();

  return (
   <div className="">
    <button>Enter</button>
   </div>
  );
};

export default Home;
