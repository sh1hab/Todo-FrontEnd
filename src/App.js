import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

// Layout
import Layout from "./layout/Layout";

// pages
import Todos from "./pages/Todos";
// import About from "./pages/About";
import NotFound from "./pages/NotFound";

let userToken;

const App = () => {

  const [cookies, setCookie] = useCookies(["uuid"]);

  if (cookies["uuid"] == null || cookies["uuid"] === undefined) {
    // getUserToken().then(() => {
    //   // setCookie("uuid", userToken);
    // });
    getUserToken();
  }

  function getUserToken() {
    axios.post(process.env.REACT_APP_API_URL + '/generate/user/token').then(res => {
      // console.log(res.data);
      userToken = res.data.uuid;
      setCookie("uuid", userToken);
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <Layout>
      <Container>
        <Switch>
          <Route path="/" component={Todos} exact />
          {/* <Route path="/about" component={About} /> */}
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Layout>
  );
};



export default App;
