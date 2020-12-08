import { Link } from "@reach/router"
const App = (props: any) => {
  return <div className="container">
    <h4>Welcome</h4>
    <ul>
      <li>
        <Link to="">
          Home
        </Link>
      </li>
      <li>
        <Link to="profile">
          Profile
        </Link>
      </li>
    </ul>
    {props.children}
  </div>;
};

export default App;
