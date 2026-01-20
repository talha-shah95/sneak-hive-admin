import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import Dashboard from "../../assets/images/sidebar/dashboard.svg?react";
// import SubscriptionLogs from "../../assets/images/sidebar/subscriptionLog.svg?react";
// import SubscriptionManagement from "../../assets/images/sidebar/subscriptionManagement.svg?react";
// import Support from "../../assets/images/sidebar/support.svg?react";
// import SupportLogs from "../../assets/images/sidebar/supportLog.svg?react";
// import User from "../../assets/images/sidebar/user.svg?react";

import { isNullOrEmpty } from '../../Utils/Utils';

import { images, svgIcons } from '../../assets/images';

import MenuIcon from './SubComponents/MenuIcon';

import { FaChevronDown } from 'react-icons/fa';

import './style.css';

const menuItems = [
  {
    id: 1,
    label: 'Dashboard',
    link: '/dashboard',
    icon: svgIcons.DashboardIcon,
  },
  {
    id: 2,
    label: 'User Management',
    link: '/user-management',
    icon: svgIcons.UserIcon,
  },
  {
    id: 3,
    label: 'Product Management',
    link: '/product-management',
    icon: svgIcons.ProductIcon,
  },
  {
    id: 4,
    label: 'Category Management',
    link: '/category-management',
    icon: svgIcons.CategoryIcon,
  },
  {
    id: 5,
    label: 'Sub Category Management',
    link: '/sub-category-management',
    icon: svgIcons.CategoryIcon,
  },
  {
    id: 6,
    label: 'Tertiary Category Management',
    link: '/tertiary-category-management',
    icon: svgIcons.CategoryIcon,
  },
  {
    id: 7,
    label: 'Brand Management',
    link: '/brand-management',
    icon: svgIcons.BrandIcon,
  },
  {
    id: 8,
    label: 'Banner Management',
    link: '/banner-management',
    icon: svgIcons.BannerIcon,
  },
  {
    id: 9,
    label: 'Player Stories Management',
    link: '/player-stories-management',
    icon: svgIcons.PlayerStoriesIcon,
  },
  {
    id: 10,
    label: 'Article Management',
    link: '/article-management',
    icon: svgIcons.ArticleIcon,
  },
  {
    id: 11,
    label: 'Release Management',
    link: '/release-calendar-management',
    icon: svgIcons.ReleaseIcon,
  },
  {
    id: 8,
    label: 'Unboxing Videos',
    link: '/unboxing-videos-management',
    icon: svgIcons.UnboxingVideosIcon,
  },
  {
    id: 12,
    label: 'Blogs Management',
    link: '/blogs-management',
    icon: svgIcons.BlogsIcon,
  },
  {
    id: 13,
    label: 'Query Management',
    link: '/query-management',
    icon: svgIcons.QueryIcon,
  },
];

const Sidebar = ({ sideBarClass, disable = false }) => {
  const location = useLocation();
  const [openItem, setOpenItem] = useState(null);
  const isCollapsed = sideBarClass === 'collapsed';
  // const { role } = useUserStore();

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  useEffect(() => {
    if (isCollapsed) {
      setOpenItem(null); // Close all items when sidebar collapses
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (sideBarClass) {
      setOpenItem(null);
    }
  }, [sideBarClass]);

  const renderLink = (to, children) => {
    if (disable) {
      return <div className={`disabledLink`}>{children}</div>;
    }
    return <Link to={to}>{children}</Link>;
  };

  return (
    <div
      className={`${`sidebar`} ${sideBarClass} ${disable ? 'disabled' : ''}`}
      id="sidebar"
    >
      {disable && <div className={`overlay`}></div>}
      <div className={`sidebar-title-wrapper`}>
        <Link to={''}>
          <img src={images.logo} alt="Profile Picture" />
        </Link>
        {/* {renderLink(
          "/",
          <h2 className={`sidebar-title`}>M{!sideBarClass && "ilestone"}</h2>
        )} */}
      </div>
      <div className={`dropdown-container`}>
        {menuItems.map((item, index) => (
          <div key={index} className={`menu-item-container`}>
            {/* Button with no sub items */}
            {item?.link && !item?.subItems?.length ? (
              renderLink(
                item.link,
                <button
                  className={`${`menu-item`} ${
                    location.pathname.includes(item.link) ? 'active' : ''
                  }`}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={openItem === item.id}
                  aria-controls={`submenu-${item.id}`}
                >
                  {/* {item.icon && <img src={item.icon} alt={item.label} />} */}
                  {item.icon && <MenuIcon svgDataUrl={item.icon} />}
                  <p className="m-0" title={item.label}>
                    {item.label}
                  </p>
                  {item.subItems ? (
                    <FaChevronDown
                      className={`${`chevron`} ${
                        openItem === item.id ? 'open' : ''
                      }`}
                    />
                  ) : (
                    ''
                  )}
                </button>
              )
            ) : (
              <>
                {/* Button with sub items */}
                <button
                  className={`${'menu-item'} ${
                    location.pathname.includes(item.link) ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    if (disable) {
                      e.preventDefault();
                      return;
                    }
                    toggleItem(item.id);
                  }}
                  aria-expanded={openItem === item.id}
                  aria-controls={`submenu-${item.id}`}
                >
                  {item.icon && <item.icon className={'icon'} />}
                  <p className="m-0">{item.label}</p>
                  {item.subItems ? (
                    <FaChevronDown
                      className={`${'chevron'} ${
                        openItem === item.id ? 'open' : ''
                      }`}
                    />
                  ) : (
                    ''
                  )}
                </button>
              </>
            )}
            {!isNullOrEmpty(item.subItems) && (
              <div
                id={`submenu-${item.id}`}
                className={`${'submenu'} ${openItem === item.id ? 'open' : ''}`}
              >
                {item.subItems.map((subItem, index) => {
                  return subItem.link ? (
                    <div key={subItem.link}>
                      {renderLink(
                        subItem.link,
                        <div
                          className={`${'submenu-item'} ${
                            index === item.subItems.length - 1
                              ? 'last-item'
                              : ''
                          } ${
                            location.pathname.includes(subItem.link)
                              ? 'active'
                              : ''
                          }`}
                        >
                          {subItem.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div key={subItem.name} className={`${'submenu-item'}`}>
                      <p className="mb-0 fst-italic">{subItem.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
