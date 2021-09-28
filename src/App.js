import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

import Layout from "./layout/Layout";
import Todos from "./pages/Todos";
import NotFound from "./pages/NotFound";

const App = () => {

  const [cookies, setCookie] = useCookies(["uuid"]);

  if (cookies["uuid"] == null || cookies["uuid"] === undefined) {
    getUserToken();
  }

  function getUserToken() {
    axios.post(process.env.REACT_APP_API_URL + '/generate/user/token').then(res => {
      setCookie("uuid", res.data.uuid);
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <Layout>
      <Container>
        <Switch>
          <Route path="/" component={Todos} exact />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Layout>
  );
};



export default App;
