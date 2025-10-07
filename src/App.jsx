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

//App
import Dashboard from './Pages/App/Dashboard';
import Profile from './Pages/App/Profile';
import EditProfile from './Pages/App/Profile/EditProfile';
import ChangePassword from './Pages/App/Profile/ChangePassword';

import UserManagement from './Pages/App/UserManagement';
import UserDetails from './Pages/App/UserManagement/UserDetails';

import CategoryManagement from './Pages/App/CategoryManagement';
import CategoryDetails from './Pages/App/CategoryManagement/CategoryDetails';
import AddCategory from './Pages/App/CategoryManagement/AddCategory';
import EditCategory from './Pages/App/CategoryManagement/EditCategory';

import SubCategoryManagement from './Pages/App/SubCategoryManagement';
import SubCategoryDetails from './Pages/App/SubCategoryManagement/SubCategoryDetails';
import AddSubCategory from './Pages/App/SubCategoryManagement/AddSubCategory';
import EditSubCategory from './Pages/App/SubCategoryManagement/EditSubCategory';

import ProductManagement from './Pages/App/ProductManagement';
import AddProduct from './Pages/App/ProductManagement/AddProduct';
import ProductDetails from './Pages/App/ProductManagement/ProductDetails';
import EditProduct from './Pages/App/ProductManagement/EditProduct';
import ProductStats from './Pages/App/ProductManagement/ProductStats';

import PlayerStoriesManagement from './Pages/App/PlayerStoriesManagement';
import PlayerStoryDetails from './Pages/App/PlayerStoriesManagement/PlayerStoryDetails';
import AddPlayerStory from './Pages/App/PlayerStoriesManagement/AddPlayerStory';
import EditPlayerStory from './Pages/App/PlayerStoriesManagement/EditPlayerStory';

import BrandManagement from './Pages/App/BrandManagement';
import AddBrand from './Pages/App/BrandManagement/AddBrand';
import BrandDetails from './Pages/App/BrandManagement/BrandDetails';
import EditBrand from './Pages/App/BrandManagement/EditBrand';

import BannerManagement from './Pages/App/BannerManagement';
import BannerDetails from './Pages/App/BannerManagement/BannerDetails';
import AddBanner from './Pages/App/BannerManagement/AddBanner';
import EditBanner from './Pages/App/BannerManagement/EditBanner';

import ReleaseCalendarManagement from './Pages/App/ReleaseCalendarManagement';
import ReleaseCalendarDetails from './Pages/App/ReleaseCalendarManagement/ReleaseCalendarDetails';
import AddReleaseCalendar from './Pages/App/ReleaseCalendarManagement/AddReleaseCalendar';
import EditReleaseCalendar from './Pages/App/ReleaseCalendarManagement/EditReleaseCalendar';

import QueryManagement from './Pages/App/QueryManagement';
import QueryDetails from './Pages/App/QueryManagement/QueryDetails';

import ArticleManagement from './Pages/App/ArticleManagement';
import ArticleDetails from './Pages/App/ArticleManagement/ArticleDetails';
import AddArticle from './Pages/App/ArticleManagement/AddArticle';
import EditArticle from './Pages/App/ArticleManagement/EditArticle';

import UnboxingVideosManagement from './Pages/App/UnboxingVideosManagement';
import UnboxingVideoDetails from './Pages/App/UnboxingVideosManagement/VideoDetails';
import AddUnboxingVideo from './Pages/App/UnboxingVideosManagement/AddVideo';
import EditUnboxingVideo from './Pages/App/UnboxingVideosManagement/EditVideo';

import BlogsManagement from './Pages/App/BlogsManagement';
import BlogDetails from './Pages/App/BlogsManagement/BlogDetails';
import AddBlog from './Pages/App/BlogsManagement/AddBlog';
import EditBlog from './Pages/App/BlogsManagement/EditBlog';

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
                <Route path="category-management/category-details/:id" element={<CategoryDetails />} />
                <Route path="category-management/add-category" element={<AddCategory />} />
                <Route path="category-management/edit-category/:id" element={<EditCategory />} />

                <Route path="sub-category-management" element={<SubCategoryManagement />} />
                <Route path="sub-category-management/sub-category-details/:id" element={<SubCategoryDetails />} />
                <Route path="sub-category-management/add-sub-category" element={<AddSubCategory />} />
                <Route path="sub-category-management/edit-sub-category/:id" element={<EditSubCategory />} />

                <Route path="product-management" element={<ProductManagement />} />
                <Route path="product-management/product-details/:id" element={<ProductDetails />} />
                <Route path="product-management/add-product" element={<AddProduct />} />
                <Route path="product-management/edit-product/:id" element={<EditProduct />} />
                <Route path="product-management/product-stats/:id" element={<ProductStats />} />

                <Route path="player-stories-management" element={<PlayerStoriesManagement />} />
                <Route path="player-stories-management/player-story-details/:id" element={<PlayerStoryDetails />} />
                <Route path="player-stories-management/add-player-story" element={<AddPlayerStory />} />
                <Route path="player-stories-management/edit-player-story/:id" element={<EditPlayerStory />} />

                <Route path="article-management" element={<ArticleManagement />} />
                <Route path="article-management/article-details/:id" element={<ArticleDetails />} />
                <Route path="article-management/add-article" element={<AddArticle />} />
                <Route path="article-management/edit-article/:id" element={<EditArticle />} />

                <Route path="brand-management" element={<BrandManagement />} />
                <Route path="brand-management/add-brand" element={<AddBrand />} />
                <Route path="brand-management/brand-details/:id" element={<BrandDetails />} />
                <Route path="brand-management/edit-brand/:id" element={<EditBrand />} />

                <Route path="banner-management" element={<BannerManagement />} />
                <Route path="banner-management/banner-details/:id" element={<BannerDetails />} />
                <Route path="banner-management/add-banner" element={<AddBanner />} />
                <Route path="banner-management/edit-banner/:id" element={<EditBanner />} />

                <Route path="release-calendar-management" element={<ReleaseCalendarManagement />} />
                <Route path="release-calendar-management/release-calendar-details/:id" element={<ReleaseCalendarDetails />} />
                <Route path="release-calendar-management/add-release-calendar" element={<AddReleaseCalendar />} />
                <Route path="release-calendar-management/edit-release-calendar/:id" element={<EditReleaseCalendar />} />

                <Route path="blogs-management" element={<BlogsManagement />} />
                <Route path="blogs-management/blog-details/:id" element={<BlogDetails />} />
                <Route path="blogs-management/add-blog" element={<AddBlog />} />
                <Route path="blogs-management/edit-blog/:id" element={<EditBlog />} />

                <Route path="query-management" element={<QueryManagement />} />
                <Route path="query-management/query-details/:id" element={<QueryDetails />} />

                <Route path="unboxing-videos-management" element={<UnboxingVideosManagement />} />
                <Route path="unboxing-videos-management/video-details/:id" element={<UnboxingVideoDetails />} />
                <Route path="unboxing-videos-management/add-video" element={<AddUnboxingVideo />} />
                <Route path="unboxing-videos-management/edit-video/:id" element={<EditUnboxingVideo />} />
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
