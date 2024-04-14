import { put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';

import { URL } from '@url';
import { CONSTANTS } from '@constants';

import { convertSnakeCaseToCamelCase } from '@app/common/dataConverter';
import { getUserByToken, updateMyInfo } from '@app/services/User';
import { checkTokenExp, toast } from '@app/common/functionCommons';

import resources from '@app/rbac/resources';
import { ACTIONS } from '@app/rbac/commons';
import { authorizePermission } from '@app/rbac/authorizationHelper';
import { create } from '@app/rbac/permissionHelper';
import { getAllCategory } from '@app/services/Category';
import { getAllGroupJoin } from '@app/services/GroupManager';

export const actionTypes = {
  RequestUser: "User/RequestUser",
  UserLoaded: "User/UserLoaded",
  UpdateMyInfo: "User/UpdateMyInfo",
  ClearToken: "App/ClearToken",
  GetPermission: "User/GetPermission",
  GetChuyenMuc: "User/GetChuyenMuc",
  RequestChuyenMuc: "User/RequestChuyenMuc",
};

const initialAuthState = {
  permissions: {},
  myInfo: {},
  chuyenMuc: [],
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.UserLoaded: {
      const { infoData } = action.payload;
      return { ...state, myInfo: Object.assign({}, state.myInfo, infoData) };
    }

    case actionTypes.GetPermission: {
      const { userPermissions } = state?.myInfo;
      const permissions = {};
      Object.entries(resources).forEach(([key, value]) => {
        permissions[key] = {};
        ACTIONS.forEach((actionItem) => {
          permissions[key][
            actionItem.code
          ] = authorizePermission(userPermissions, [create(value, actionItem)]);
        });
      });
      return Object.assign({}, state, {
        permissions: convertSnakeCaseToCamelCase(permissions),
      });
    }
    case actionTypes.GetChuyenMuc: {
      const { infoChuyenMuc } = action.payload;
      return { ...state, chuyenMuc: infoChuyenMuc };
    }

    default:
      return state;
  }
};

export const actions = {
  requestUser: (history) => ({
    type: actionTypes.RequestUser,
    payload: { history },
  }),
  userLoaded: (infoData) => ({
    type: actionTypes.UserLoaded,
    payload: { infoData },
  }),
  updateMyInfo: (myInfo) => ({
    type: actionTypes.UpdateMyInfo,
    payload: { myInfo },
  }),
  clearToken: () => ({
    type: actionTypes.ClearToken,
    payload: { token: null },
  }),
  getPermission: () => ({ type: actionTypes.GetPermission }),
  updateChuyenMuc: (infoChuyenMuc) => ({
    type: actionTypes.GetChuyenMuc,
    payload: { infoChuyenMuc },
  }),
  requestChuyenMuc: () => ({ type: actionTypes.RequestChuyenMuc }),
};

export function* saga() {
  yield takeLatest(actionTypes.RequestUser, function* requestUserSaga(data) {
    const { history } = data?.payload;
    const token = Cookies.get("token");
    if (checkTokenExp(token)) {
      const dataResponse = yield getUserByToken();
      if (dataResponse) {
        yield put(actions.userLoaded(dataResponse));
      }
    } else {
      yield put(actions.clearToken());
      history.push(URL.LOGIN);
    }
  });
  yield takeLatest(actionTypes.UpdateMyInfo, function* updateMyInfoSaga(data) {
    const dataResponse = yield updateMyInfo(data?.payload?.myInfo);
    if (dataResponse) {
      delete dataResponse.password;
      yield put(actions.userLoaded(dataResponse));
      toast(CONSTANTS.SUCCESS, "Cập nhật thông tin thành công");
    }
  });
  yield takeLatest(actionTypes.RequestChuyenMuc, function* getCM() {
    const dataChuyenMucMoi = yield getAllGroupJoin();
    if (dataChuyenMucMoi) {
      yield put(actions.updateChuyenMuc(dataChuyenMucMoi));
    }
  });
}
