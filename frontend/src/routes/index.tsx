import Layout from "../layouts/Layout";
import { Routes } from "../models/Routes";
import Home from "../view/app/home/Home";
import Profile from "../view/app/profile/Profile";
import Dialog from "../view/dialog/Dialog";
import Landing from "../view/landing/Landing";
import Login from "../view/login/LoginPage";
import Register from "../view/register/Register";
import ResetPassword from "../view/reset-password/ResetPassword";
import Signout from "../view/signout/Signout";
import {
  UserOutlined,
  DashboardOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import User from "../view/app/user/User";
import ChartLayout from "../view/app/charts/index"
import Insight from "../view/app/charts/insight/Insight";
import Analytics from "../view/app/charts/analytics/Analytics";

const routes: Routes[] = [
  {
    component: Landing,
    name: "Landing",
    path: "/",
  },
  {
    component: Login,
    name: "Login",
    path: "/oauth2/authorize",
  },
  {
    component: Login,
    name: "Login",
    path: "/login",
  },
  {
    component: Signout,
    name: "Signout",
    path: "/logout",
  },
  {
    component: Register,
    name: "Register",
    path: "/oauth2/register",
  },
  {
    component: Register,
    name: "Login",
    path: "/signup",
  },
  {
    component: ResetPassword,
    name: "Reset Password",
    path: "/password/new",
  },
  {
    component: Dialog,
    name: "Dialog",
    path: "/oauth2/authorize/dialog",
  },
  {
    component: Layout,
    name: "TASS",
    path: "/app",
    isProtected: true,
    subroutes: [
      {
        component: Home,
        name: "Dashboard",
        path: "/",
        isSiderMenu: true,
        icon: <DashboardOutlined />
      },
      {
        component: User,
        name: "Users",
        path: "users",
        isSiderMenu: true,
        icon: <UserOutlined />
      },
      {
        component: ChartLayout,
        name: "Charts",
        path: "charts",
        isSiderMenu: true,
        icon: <AreaChartOutlined />,
        subroutes: [
          {
            name: "Insight",
            path: "insight",
            icon: <AreaChartOutlined />,
            component: Insight
          },
          {
            name: "Analytics",
            path: "analytics",
            icon: <AreaChartOutlined />,
            component: Analytics
          },
        ]
      },
      {
        component: Profile,
        name: "Profile",
        path: "profile",
      },
    ],
  },
];
export default routes;
