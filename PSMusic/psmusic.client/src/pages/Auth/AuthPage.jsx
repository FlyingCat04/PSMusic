import React, { useState } from "react";
import "./AuthPage.css";
import SignInForm from "../../components/Auth/SignIn";
import SignUpForm from "../../components/Auth/SignUp";

export default function AuthPage() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) setType(text);
  };

  const containerClass = "container " + (type === "signUp" ? "rightPanelActive" : "");

  return (
    <div className="app">
      <div className={containerClass}>
        <SignUpForm />
        <SignInForm />

        <div className="overlayContainer">
          <div className="overlay">
            <div className="overlayPanel overlayLeft">
              <h1>Chào mừng!</h1>
              <p>Nhập vào thông tin tài khoản và bắt đầu khám phá</p>
              <button
                className="ghost"
                onClick={() => handleOnClick("signIn")}
              >
                Đăng nhập
              </button>
            </div>
            <div className="overlayPanel overlayRight">
              <h1>Mừng trở lại!</h1>
              <p>Hãy đăng nhập bằng tài khoản của bạn và tiếp tục hành trình với chúng tôi</p>
              <button
                className="ghost"
                onClick={() => handleOnClick("signUp")}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
