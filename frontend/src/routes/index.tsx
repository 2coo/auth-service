import {
  AreaChartOutlined, DashboardOutlined, UserOutlined
} from '@ant-design/icons';
import CarouselForm from "../components/layout/carousel-form/CarouselForm";
import Layout from "../layouts/Layout";
import { Routes } from "../models/Routes";
import Analytics from "../view/app/charts/analytics/Analytics";
import ChartLayout from "../view/app/charts/index";
import Insight from "../view/app/charts/insight/Insight";
import Home from "../view/app/home/Home";
import Profile from "../view/app/profile/Profile";
import User from "../view/app/user/User";
import Dialog from "../view/dialog/Dialog";
import Landing from "../view/landing/Landing";
import LoginPage from "../view/login/LoginPage";
import ForgotPasswordPage from "../view/forgot-password/ForgotPasswordPage";
import SignUpPage from '../view/sign-up/SignUpPage';
import Signout from '../view/signout/Signout';
import ValidateEmailPage from '../view/validate-email/ValidateEmailPage';

const routes: Routes[] = [
  {
    component: Landing,
    name: "Landing",
    path: "/",
  },
  {
    component: ValidateEmailPage,
    name: "SignUp",
    path: "/signup/validate-email",
  },
  {
    component: CarouselForm,
    path: '/',
    name: 'CarouselLayout',
    subroutes: [
      {
        component: LoginPage,
        name: "Login",
        path: "/login",
      },
      {
        component: SignUpPage,
        name: "SignUp",
        path: "/signup",
      },
      {
        component: ForgotPasswordPage,
        name: "Reset Password",
        path: "/login/forgot",
      },
    ],
  },
  {
    component: Signout,
    name: "Signout",
    path: "/logout",
  },
  {
    component: LoginPage,
    name: "Authorization",
    path: "/oauth2/authorize",
  },
  {
    component: ForgotPasswordPage,
    name: "Reset Password Page",
    path: "/oauth2/forgot",
  },
  {
    component: SignUpPage,
    name: "Registration",
    path: "/oauth2/register",
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
