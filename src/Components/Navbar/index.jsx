import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Navbar as BootstrapNavbar, Dropdown } from 'react-bootstrap';

import useUserStore from '../../Store/UserStore';

import { GoBell } from 'react-icons/go';
import { HiMenu, HiOutlineColorSwatch } from 'react-icons/hi';
import { LuLogOut } from 'react-icons/lu';
import { RiUserSettingsLine } from 'react-icons/ri';
import { RxCaretDown } from 'react-icons/rx';
// import {
//   editNotification,
//   getNotifications,
// } from "../../Services/Admin/Notifications";
// import { calculateTimePassed } from "../../Utils/Utils";
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
// import TableActionDropDown from "../TableActionDropDown/";
import ProfileDropDown from './SubComponents/ProfileDropdown';

import './style.css';
import { clearAuthData } from '../../Utils/Storage';
import { images } from '../../assets/images';
import useModalStore from '../../Store/ModalStore';
import CustomToggleSwitch from '../CustomToggle';
import { useForm } from '../../Hooks/useForm';
import { LogoutUser } from '../../Pages/Auth/Login/Services/Logout';

const Navbar = ({ sideBarToggle, sideBarClass }) => {
  let navigate = useNavigate();
  const { user, setLogout } = useUserStore();
  const { showModal, closeModal } = useModalStore();

  console.log('user', user);

  // const branch_name = user?.branch_name;

  // const { data: notificationsData } = useQuery({
  //   queryKey: ["getNotifications", params],
  //   queryFn: () => getNotifications(params),
  //   refetchOnWindowFocus: false,
  //   retry: 1,
  //   enabled: role === "admin",
  // });

  // const notificationState = notificationsData?.notifications?.data ?? [];

  // const editNotificationMutation = useMutation({
  //   mutationFn: (id) => editNotification(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("PackageDetails");
  //   },
  //   onError: (error) => {
  //     console.error("Error updating notification", error);
  //     showErrorToast(error);
  //   },
  // });

  // const getInitials = (name = "") => {
  //   return name
  //     ?.split(" ")
  //     ?.map((word) => word?.[0]?.toUpperCase())
  //     ?.join("");
  // };

  const { mutate, isLoading } = useForm({
    successMessage: 'Logout successful!',
    redirectTo: '/login',

    onSuccess: () => {
      closeModal();
      clearAuthData();
      setLogout();
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  const handleLogoutClick = () => {
    showModal({
      type: 'question',
      modalProps: {
        title: 'Logout?',
        message: 'Are you sure you want to logout?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: () => {
          handleLogout();
        },
      },
    });
  };

  const handleLogout = () => {
    mutate({
      service: LogoutUser,
      data: {},
    });
  };

  // const markAsRead = (id) => {
  //   editNotificationMutation.mutate(id);
  // };

  return (
    <>
      <BootstrapNavbar className={`customHeader ${sideBarClass}`} expand="md">
        <div className="d-flex gap-2 gap-sm-3">
          <div
            className={`toggleSidebarButton flexCentered ${sideBarClass}`}
            onClick={sideBarToggle}
          >
            <HiMenu size={26} />
          </div>
        </div>
        <div className="navBarLogo">
          {/* <img
            src={user.profile_image ? user.profile_image : ""}
            alt="Profile Picture"
          /> */}
        </div>

        <div className="d-flex align-items-center gap-2 gap-sm-3">
          {/* {role !== "admin" && (
            <CustomButton onClick={() => navigate("support")}>
              Support
            </CustomButton>
          )} */}

          {/* <Dropdown className="notiDropdown d-flex ">
            <Dropdown.Toggle
              variant="transparent"
              className="position-relative notButton  p-0"
            >
              <GoBell className="notification-bell-icon" size={28} />
              <span className="badge">
                {notificationState.length > 9 ? "9+" : notificationState.length}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className={`notiMenu`} align="end">
              <div className="notificationsBody">
                <div className="notificationsBodyHeader py-2">
                  <p className="mb-0 fw-medium">Notifications</p>
                  <div className="newNotificationCount">
                    <p>{notificationState.length} new</p>
                  </div>
                </div>
                <hr className="my-0" />
                {notificationState?.map((notification, index) => (
                  <div
                    className={`singleNoti gap-2 ${
                      notification.read_at ? "read" : "unread"
                    }`}
                    key={index}
                  >
                    <div className="notificationBell">
                      <GoBell size={18} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="notiFooter">
                <Dropdown.Toggle
                  variant="transparent"
                  className="notButton notifi-btn p-0"
                >
                  <Link to={'/notifications'}>View All</Link>
                </Dropdown.Toggle>
              </div>
            </Dropdown.Menu>
          </Dropdown> */}

          {/* <CustomButton onClick={() => toggleTheme()}>
            Toggle Theme
          </CustomButton> */}
          <ProfileDropDown
            actions={[
              {
                name: 'My Profile',
                icon: RiUserSettingsLine,
                onClick: () => {
                  navigate('/profile');
                },
                disabled: isLoading,
              },
              {
                name: 'Logout',
                icon: LuLogOut,
                onClick: handleLogoutClick,
                disabled: isLoading,
              },
            ]}
          >
            <div className="d-flex align-items-center gap-2">
              <div className="userImage">
                <img
                  src={user.avatar || images?.userPlaceholder}
                  alt="Profile Picture"
                  onError={(e) => {
                    e.target.src = images?.userPlaceholder;
                  }}
                />
                {/* <h6>{getInitials(user?.full_name)}</h6> */}
              </div>
              <p className="colorSecondary text14 m-0 text-capitalize">
                {user?.first_name} {user?.last_name}
              </p>
              <RxCaretDown />
            </div>
          </ProfileDropDown>
        </div>
      </BootstrapNavbar>
      {/* <CustomModal
        show={logoutModal}
        close={() => {
          setLogoutModal(false);
        }}
        action={handleLogout}
        title="Logout?"
        description="Are you sure you want to logout?"
      /> */}
    </>
  );
};

export default Navbar;
