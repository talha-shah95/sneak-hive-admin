import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Styles
import './App.css';
import './assets/style/index.css';

// Stores and Hooks
import useUserStore from './Store/UserStore';
import useAuthInit from './Hooks/useAuthInit.js';

import AuthLayout from './Layouts/AuthLayout';
import AppLayout from './Layouts/AppLayout';

import GlobalSkeleton from './Components/SkeletonLoaders/GlobalSkeleton.jsx';

//Auth
import Login from './Pages/Auth/Login';
import ForgetPassword from './Pages/Auth/ForgetPassword';
import Registration from './Pages/Auth/Registration';

//Common
import Dashboard from './Pages/App/Common/Dashboard';
import Profile from './Pages/App/Profile';
import EditProfile from './Pages/App/Profile/EditProfile';
import ChangePassword from './Pages/App/Profile/ChangePassword';

import UserManagement from './Pages/App/UserManagement';
import UserDetails from './Pages/App/UserManagement/UserDetails';

import CategoryManagement from './Pages/App/CategoryManagement';

import BrandManagement from './Pages/App/BrandManagement';
import AddBrand from './Pages/App/BrandManagement/AddBrand';
import BrandDetails from './Pages/App/BrandManagement/BrandDetails';
import EditBrand from './Pages/App/BrandManagement/EditBrand';

import BannerManagement from './Pages/App/BannerManagement';
import BannerDetails from './Pages/App/BannerManagement/BannerDetails';
import AddBanner from './Pages/App/BannerManagement/AddBanner';
import EditBanner from './Pages/App/BannerManagement/EditBanner';

import QueryManagement from './Pages/App/QueryManagement';
import QueryDetails from './Pages/App/QueryManagement/QueryDetails';

import CustomToast from './Components/CustomToast';
import CustomModal from './Components/CustomModal';

function App() {
  const queryClient = new QueryClient();
  const PublicRoutes = lazy(() => import('./Router/PublicRoutes'));
  const PrivateRoutes = lazy(() => import('./Router/PrivateRoutes'));
  const { isLoggedIn, token, user } = useUserStore();
  useAuthInit();

  // const [count, setCount] = useState(0);
  const isAuthenticated = isLoggedIn && token && user;

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<GlobalSkeleton />}>
        <BrowserRouter basename="/sneak-hive-admin">
          <Routes>
            {/* Root route */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route element={<PublicRoutes isAuthenticated={isAuthenticated} redirectTo="/dashboard" />}>
              <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="forget-password" element={<ForgetPassword />} />
                <Route path="registration" element={<Registration />} />
                {/* Add other public routes here */}
              </Route>
            </Route>

            {/* Private routes wrapped with AppLayout */}
            <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} redirectTo="/login" />}>
              <Route element={<AppLayout />}>
                {/* Common Routes */}
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="profile/change-password" element={<ChangePassword />} />

                <Route path="user-management" element={<UserManagement />} />
                <Route path="user-management/details/:id" element={<UserDetails />} />

                <Route path="category-management" element={<CategoryManagement />} />

                <Route path="brand-management" element={<BrandManagement />} />
                <Route path="brand-management/add-brand" element={<AddBrand />} />
                <Route path="brand-management/brand-details/:id" element={<BrandDetails />} />
                <Route path="brand-management/edit-brand/:id" element={<EditBrand />} />

                <Route path="banner-management" element={<BannerManagement />} />
                <Route path="banner-management/banner-details/:id" element={<BannerDetails />} />
                <Route path="banner-management/add-banner" element={<AddBanner />} />
                <Route path="banner-management/edit-banner/:id" element={<EditBanner />} />

                <Route path="query-management" element={<QueryManagement />} />
                <Route path="query-management/query-details/:id" element={<QueryDetails />} />
                {/* <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="profile/change-password" element={<ChangePassword />} />
                <Route path="product-management" element={<ProductManagement />} />
                <Route path="product-management/product-details/:id" element={<ProductDetails />} />
                <Route path="product-management/add-product" element={<AddProduct />} />
                <Route path="product-management/edit-product/:id" element={<EditProduct />} />
                <Route path="payment-logs" element={<PaymentLogs />} />
                <Route path="order-management" element={<OrderManagement />} />
                <Route path="order-management/order-details/:id" element={<OrderDetails />} />
                <Route path="keg-rental-management" element={<KegRentalManagement />} />
                <Route path="keg-rental-management/keg-rental-details/:id" element={<KegRentalDetails />} />
                <Route path="feature-plan-management" element={<FeaturePlanManagement />} />
                <Route path="feature-plan-management/buy-feature-plan" element={<BuyFeaturePlan />} />
                <Route path="feature-plan-management/new-feature-plan-details/:id" element={<NewFeaturePlanDetails />} />
                <Route path="event-management" element={<EventManagement />} />
                <Route path="event-management/add-event" element={<AddEvent />} />
                <Route path="event-management/event-details/:id" element={<EventDetails />} /> */}
                {/* <Route path="event-management/edit-event/:id" element={<EditEvent />} /> */}

                {/* Vendor Routes */}
                {/* <Route path="promo-code-management" element={<PromoCodeManagement />} />
                <Route path="promo-code-management/promo-code-details/:id" element={<PromoCodeDetails />} />
                <Route path="promo-code-management/add-promo-code" element={<AddPromoCode />} />
                <Route path="promo-code-management/edit-promo-code/:id" element={<EditPromoCode />} />
                <Route path="documents-history" element={<DocumentsHistory />} />
                <Route path="documents-history/document-details/:id" element={<DocumentDetails />} />
                <Route path="ad-logs" element={<AdLogs />} />
                <Route path="ad-logs/ad-details/:id" element={<AdDetails />} />
                <Route path="ad-logs/ad-request" element={<AdRequest />} /> */}
                {/* Add other private routes here */}
              </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <CustomModal />
        <CustomToast />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
