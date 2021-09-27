// router
import { BrowserRouter as Router } from "react-router-dom";

// components
import Menu from "../components/Menu";

const Layout = ({ children }) => {
  return (
    <Router>
      <Menu />
      <main>{children}</main>
    </Router>
  );
};

export default Layout;
