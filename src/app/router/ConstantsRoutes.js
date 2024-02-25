import React, { lazy, useEffect, useState } from "react";
import {
  HomeIcon,
  ListIcon,
  SettingIcon,
  UserIcon,
} from "@app/components/Icons";

import { URL } from "@url";
import { create } from "@app/rbac/permissionHelper";
import resources from "@app/rbac/resources";
import actions from "@app/rbac/actions";
import { connect, useSelector } from "react-redux";
import { cloneObj } from "@app/common/dataConverter";

const MyInfo = lazy(() => import("@containers/MyInfo/MyInfo"));
const TrangChu = lazy(() => import("@containers/TrangChu/TrangChu"));
const Setting = lazy(() => import("@containers/Setting/Setting"));
const DuLieuBoSung = lazy(() =>
  import("@containers/DuLieuBoSung/DuLieuBoSung")
);
const User = lazy(() => import("@containers/User/User"));
const DonVi = lazy(() => import("@containers/DonVi/DonVi"));
const KhoiPhucTaiKhoan = lazy(() =>
  import("@containers/User/KhoiPhucTaiKhoan")
);
const Role = lazy(() => import("@containers/Role/Role"));
const ChuyenMuc = lazy(() => import("@containers/ChuyenMuc/ChuyenMuc"));
function renderIcon(icon) {
  return (
    <span role="img" className="main-menu__icon">
      <div
        className="position-absolute"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div
          className="position-relative"
          style={{ width: "30px", height: "30px" }}
        >
          {icon}
        </div>
      </div>
    </span>
  );
}

const MY_INFO_ROUTE = {
  path: URL.THONG_TIN_CA_NHAN,
  breadcrumbName: "Thông tin cá nhân",
  component: MyInfo,
  permission: [],
};

export function GetRouterByCategory() {
  //const chuyenMuc = useSelector(state => state);
  return [
    {
      path: URL.MENU.USER,
      menuName: "Danh sách nJJJgười dùng",
      component: User,
      permission: [create(resources.NGUOI_DUNG, actions.READ)],
    },
    {
      path: URL.MENU.KHOI_PHUC_TAI_KHOAN,
      menuName: "Khôi phục tài khoản",
      component: KhoiPhucTaiKhoan,
      permission: [create(resources.NGUOI_DUNG, actions.READ)],
    },
    {
      path: URL.MENU.ROLE,
      menuName: "Vai trò",
      component: Role,
      permission: [create(resources.VAI_TRO, actions.READ)],
    },
  ];
}
export const TRANG_CHU = [
  {
    path: URL.MENU.DASHBOARD,
    menuName: "Trang chủ",
    component: TrangChu,
    icon: renderIcon(<HomeIcon />),
    permission: [],
  },
];
export const ADMIN_ROUTES = [
  //Dien router vao day neu co menu

  // not render in menu
  MY_INFO_ROUTE,
];
export const ADMIN_ROUTES2 = {
  key: URL.MENU.CHUYEN_MUC_FORMAT,
  menuName: "Chuyên mục",
  icon: renderIcon(<ListIcon />),
  children: [],
};
export function ConstantsRoutes(chuyenMuc) {
  let chuyenMucRouter = chuyenMuc.map((res) => {
    return {
      path: URL.MENU.CHUYEN_MUC_FM.format(res._id),
      menuName: res.name,
      component: ChuyenMuc,
      permission: [],
    };
  });
  const cm = [
    {
      ...ADMIN_ROUTES2,
      children: [
        {
          path: URL.MENU.CHUYEN_MUC_FORMAT,
          menuName: "Tất cả chuyên mục",
          component: ChuyenMuc,
          permission: [],
        },
        ...chuyenMucRouter,
      ],
    },
  ];
  const combinedArray = [...TRANG_CHU, ...cm, ...ADMIN_ROUTES];
  return combinedArray;
}
