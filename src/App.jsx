import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Footer from "./components/Footer";
import Header from "./components/Header";

function Layout({ children }) {


  
  const [location] = useLocation();
  const isAuthOrCheckout = location === "/login" || location === "/checkout";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthOrCheckout && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthOrCheckout && <Footer />}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <Layout>
        <Router />
      </Layout>
    </>
  );
}

export default App;
