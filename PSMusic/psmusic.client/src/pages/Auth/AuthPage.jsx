import React, { useState } from "react";
import styles from "./AuthPage.module.css";
import SignInForm from "../../components/Auth/SignIn";
import SignUpForm from "../../components/Auth/SignUp";

export default function AuthPage() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) setType(text);
  };

    const containerClass = `${styles.container} ${type === "signUp" ? styles.rightPanelActive : ""}`;

  return (
    <div className={styles.app}>
      <div className={containerClass}>
        <SignUpForm activeType={type} />
        <SignInForm activeType={type} />

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Chào mừng!</h1>
              <p>Nhập vào thông tin tài khoản và bắt đầu khám phá</p>
              <button
                className={styles.ghost}
                onClick={() => handleOnClick("signIn")}
              >
                Đăng nhập
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Mừng trở lại!</h1>
              <p>Hãy đăng nhập bằng tài khoản của bạn và tiếp tục hành trình với chúng tôi</p>
              <button
                className={styles.ghost}
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
