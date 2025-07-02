import "./App.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";

function App() {
  const HeaderTitle = "React Router";
  const FooterMessage = "This is the footer message for the entire app.";
  const menu_list = [
    { menu_id: 1, title: "Home", url: "/" },
    { menu_id: 2, title: "About", url: "/about" },
    { menu_id: 3, title: "Services", url: "/services" },
    { menu_id: 4, title: "Contact", url: "/contact" },
  ];
  return (
    <div className="App">
      <Routes>
        <Route
          element={
            <Layout
              title={HeaderTitle}
              footermessage={FooterMessage}
              menu_list={menu_list}
            />
          }
        >
          {menu_list.map((menu) => (
            <Route
              key={menu.menu_id}
              path={menu.url}
              element={<h1>{menu.title}</h1>}
            />
          ))}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
