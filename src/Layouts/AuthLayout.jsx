// layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

import { images } from '../assets/images';
import './style/AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="authLayout w-100 py-5">
      <div className="authCard bgWhite w-100 row">
        <div className="col-12">
          {/* {/* <div className="authCardImage col-lg-6 d-none d-lg-flex align-items-start justify-content-center py-5 px-2"> */}
          <div className="authCardImage my-5">
            <img src={images.authCardImage} alt="" loading="lazy" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
