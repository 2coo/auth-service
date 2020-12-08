import Layout from "../layout/Layout";
import { Routes } from "../models/Routes";
import Home from "../view/app/home/Home";
import Profile from "../view/app/profile/Profile";
import Dialog from "../view/dialog/Dialog";
import Landing from "../view/landing/Landing";
import Login from "../view/login/LoginPage";

const routes: Array<Routes> = [
  {
    component: Login,
    label: "Login",
    path: "/oauth2/authorize",
  },
  {
    component: Dialog,
    label: "Dialog",
    path: "/oauth2/authorize/dialog",
  },
  {
    component: Landing,
    label: "Landing",
    path: "/",
  },
  {
    component: Layout,
    label: "TASS",
    path: "app",
    isProtected: true,
    subroutes: [
      {
        component: Home,
        label: "Home",
        path: "/",
      },
      {
        component: Profile,
        label: "Profile",
        path: "/profile",
      },
    ],
  },
];
export default routes;
