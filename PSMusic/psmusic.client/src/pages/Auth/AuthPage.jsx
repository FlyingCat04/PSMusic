import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AuthPage.module.css";
import SignInForm from "../../components/Auth/SignIn";
import SignUpForm from "../../components/Auth/SignUp";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";

export default function AuthPage() {
  const { t } = useTranslation();
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) setType(text);
  };

  const containerClass = `${styles.container} ${type === "signUp" ? styles.rightPanelActive : ""}`;

  return (
    <div className={styles.app}>
      <div className={styles.languageSwitcherWrapper}>
        <LanguageSwitcher />
      </div>
      <div className={containerClass}>
        <SignUpForm activeType={type} />
        <SignInForm activeType={type} />

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>{t('welcome_msg')}</h1>
              <p>{t('welcome_desc')}</p>
              <button
                className={styles.ghost}
                onClick={() => handleOnClick("signIn")}
              >
                {t('login_btn')}
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>{t('welcome_back_msg')}</h1>
              <p>{t('welcome_back_desc')}</p>
              <button
                className={styles.ghost}
                onClick={() => handleOnClick("signUp")}
              >
                {t('register_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
