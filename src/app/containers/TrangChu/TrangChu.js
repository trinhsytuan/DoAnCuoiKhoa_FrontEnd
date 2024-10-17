import React from "react";
import { connect } from "react-redux";
import "./TrangChu.scss";
import BaseContent from "@components/BaseContent";
import TLOGO from "@assets/images/logo/tshare-bgg.png";
import HOMEPAGECENTER from "@assets/images/logo/homepage-center.svg";
function TrangChu({ isLoading, myInfo, ...props }) {
  return (
    <BaseContent className={"home-page-container"}>
      <div>
        <h1>Chào mừng các thầy cô và các bạn đến với SafeDrive</h1>
        <img src={HOMEPAGECENTER} />
      </div>
    </BaseContent>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps)(TrangChu);
