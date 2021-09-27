import { BrowserRouter as Router } from "react-router-dom";

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
