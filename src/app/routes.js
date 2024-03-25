import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";
import Index from "./views/categories";
import CategoryIndex from "./views/categories";
import SubCategoryIndex from "./views/subcategories";
import ProductIndex from "./views/products";
import UnitOfMeasurementIndex from "./views/unitofmeasurement";
import SellerIndex from "./views/seller";
import BuyerIndex from "./views/buyer";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));
// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));

const AddCategory = Loadable(lazy(() => import("app/views/categories/add")));
const EditCategory = Loadable(lazy(() => import("app/views/categories/edit")));
const AddProduct = Loadable(lazy(() => import("app/views/products/add")));
const AddSubCategory = Loadable(lazy(() => import("app/views/subcategories/add")));
const EditSubCategory = Loadable(lazy(() => import("app/views/subcategories/edit")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor },

      // e-chart route
      { path: "/categories", element: <CategoryIndex />, auth: authRoles.editor },
      { path: "/subcategories", element: <SubCategoryIndex />, auth: authRoles.editor },
      { path: "/products", element: <ProductIndex />, auth: authRoles.editor },
      { path: "/products/add", element: <AddProduct />, auth: authRoles.editor },
      { path: "/unitofmeasurement", element: <UnitOfMeasurementIndex />, auth: authRoles.editor },
      { path: "/seller", element: <SellerIndex />, auth: authRoles.editor },
      { path: "/buyer", element: <BuyerIndex />, auth: authRoles.editor },
      { path: "/categories/add", element: <AddCategory />, auth: authRoles.editor },
      { path: "/categories/edit/:id", element: <EditCategory />, auth: authRoles.editor },
      { path: "/subcategories/add", element: <AddSubCategory />, auth: authRoles.editor },
      { path: "/subcategories/edit", element: <EditSubCategory />, auth: authRoles.editor }
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="dashboard/default" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
