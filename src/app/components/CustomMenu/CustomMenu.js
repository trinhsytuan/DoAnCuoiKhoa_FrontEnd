import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { connect } from 'react-redux';

import { ConstantsRoutes } from '@app/router/ConstantsRoutes';
import { checkPermission } from '@app/rbac/checkPermission';
import { checkLoaded, formatUnique } from '@app/common/functionCommons';

import * as app from '@app/store/ducks/app.duck';

import './CustomMenu.scss';
import SafeDriveLOGO from '@assets/images/logo/logofict.png';

function CustomMenu({ siderCollapsed, isBroken, myInfo, locationPathCode, chuyenMuc, ...props }) {
  const keyRef = useRef([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [pathnameFormat, setPathnameFormat] = useState(null);

  const CONSTANTS_ROUTES = ConstantsRoutes(chuyenMuc);

  useEffect(() => {
    if (siderCollapsed) {
      keyRef.current = openKeys;
      setOpenKeys([]);
    } else {
      setOpenKeys(keyRef.current);
    }
  }, [siderCollapsed]);

  useEffect(() => {
    let keys = [...openKeys, ...keyRef.current];
    CONSTANTS_ROUTES.forEach((menu) => {
      if (!menu.hide && menu.menuName && Array.isArray(menu.children)) {
        menu.children.forEach((child) => {
          if (!child.hide && pathnameFormat && [child.key, child.path].includes(pathnameFormat)) {
            keys = formatUnique([...keys, "path" + (menu.key || menu.path)]);
          }
        });
      }
    });

    if (checkLoaded()) {
      if (siderCollapsed) {
        keyRef.current = keys;
      } else {
        setOpenKeys(keys);
      }
    } else {
      window.onload = function () {
        setOpenKeys(keys);
      };
    }
  }, [pathnameFormat]);

  function handleCheckPermission(permissionGranted, path) {
    return checkPermission(myInfo, path);
  }

  function handleActiveMenuForComponentDetail(menu) {
    if (menu.path !== pathnameFormat) {
      if (menu.path === locationPathCode) {
        setPathnameFormat(menu.path);
      }

      if (Array.isArray(menu.children)) {
        menu.children.forEach((child) => {
          if (child.path === locationPathCode) {
            setPathnameFormat(menu.path);
          }
        });
      }
    }
  }

  function renderItem(menu) {
    handleActiveMenuForComponentDetail(menu);
    if (menu.hide || !menu.menuName) return;
    let hasPermission = checkPermission(myInfo, menu.permission);
    if (!hasPermission) return;
    return (
      <Menu.Item key={menu.path} icon={menu.icon}>
        <Link to={menu.path}>{menu.menuName}</Link>
      </Menu.Item>
    );
  }

  function handleTitleClick(value) {
    const { key } = value;
    if (openKeys.includes(key)) {
      setOpenKeys(openKeys.filter((openKey) => openKey !== key));
    } else {
      setOpenKeys([...openKeys, key]);
    }
  }

  function renderSubItem(menu) {
    if (menu.hide) return;
    let hasPermission = checkPermission(myInfo, menu.permission);
    if (menu.key) {
      hasPermission = false;
      let subMenuHasPermission = 0;
      menu.children.forEach((sub) => {
        if (!sub.hide && checkPermission(myInfo, menu.permission)) {
          subMenuHasPermission += 1;
        }
      });
      if (subMenuHasPermission > 0) {
        hasPermission = true;
      }
    }

    return (
      hasPermission && (
        <Menu.SubMenu
          key={"path" + menu.key}
          title={menu.menuName}
          icon={menu.icon}
          onTitleClick={handleTitleClick}
          disabled={!hasPermission}
        >
          {hasPermission &&
            menu.children.map((child) => {
              if (child.path) {
                return renderItem(child);
              }
              if (child.key && Array.isArray(child.children)) {
                return renderSubItem(child);
              }
            })}
        </Menu.SubMenu>
      )
    );
  }
  const menuItem = CONSTANTS_ROUTES.map((menu) => {
    if (menu.path) {
      return renderItem(menu);
    }
    if (menu.key && Array.isArray(menu.children)) {
      return renderSubItem(menu);
    }
  });

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <div className={`sider-logo ${siderCollapsed && !isBroken ? "collapsed" : ""}`}>
        <div className="logo">
          <img src={SafeDriveLOGO} className="logo-SafeDrive" />
          <h3>SafeDrive</h3>
        </div>

        {/*<div className="toggle-menu">
        <img src={siderCollapsed ? ARROW_RIGHT : ARROW_LEFT} alt="" onClick={props.toggleCollapsed}/>
      </div>*/}
      </div>
      <div className="custom-scrollbar aside-menu">
        <Menu
          mode="inline"
          className="main-menu"
          {...(siderCollapsed ? {} : { openKeys })}
          selectedKeys={[pathnameFormat]}
          expandIcon={({ isOpen }) => {
            if (!siderCollapsed)
              return (
                <div className="expand-icon">
                  <i className={`fa fa-chevron-right ${isOpen ? "fa-rotate-90" : ""}`} aria-hidden="true" />
                </div>
              );
            return null;
          }}
        >
          {menuItem}
        </Menu>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, locationPathCode } = store.app;
  const { myInfo, chuyenMuc } = store.user;
  return { siderCollapsed, isBroken, locationPathCode, myInfo, chuyenMuc };
}

export default connect(mapStateToProps, app.actions)(CustomMenu);
