import Layout from "../layout/Layout";
import { Routes } from "../models/Routes";
import Home from "../view/app/home/Home";
import Profile from "../view/app/profile/Profile";
import Dialog from "../view/dialog/Dialog";
import Landing from "../view/landing/Landing";
import Login from "../view/login/LoginPage";
import Register from "../view/register/Register";
import ResetPassword from "../view/reset-password/ResetPassword";
import Signout from "../view/signout/Signout";

const routes: Array<Routes> = [
  {
    component: Landing,
    label: "Landing",
    path: "/",
  },
  {
    component: Login,
    label: "Login",
    path: "/oauth2/authorize",
  },
  {
    component: Signout,
    label: "Signout",
    path: "/logout",
  },
  {
    component: Register,
    label: "Register",
    path: "/oauth2/register",
  },
  {
    component: ResetPassword,
    label: "Reset Password",
    path: "/password/new",
  },
  {
    component: Dialog,
    label: "Dialog",
    path: "/oauth2/authorize/dialog",
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
