import { React, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoadSpinner from "../LoadSpinner/LoadSpinner"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import styles from "./SignIn.module.css";

function SignInForm({ activeType }) {
  const { t } = useTranslation();
  const [state, setState] = useState({ name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    setState({ name: "", password: "" });
    setError("");
    setSuccess("");
    setShowPassword(false);
  }, [activeType]);

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
    setError("");
  };


  // const handleOnSubmit = async evt => {
  //   evt.preventDefault();

  //   const { name, password } = state;
  //   setLoading(true)

  //   // 🔹 Kiểm tra logic đăng nhập mẫu (bạn có thể thay bằng call API sau này)
  //   // if (name !== "admin" || password !== "123456") {
  //   //   setError("Tên đăng nhập hoặc mật khẩu không đúng.");
  //   //   return;
  //   // }


  //   try {
  //       const response = await fetch("https://localhost:7215/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ username: name, password: password })
  //     });

  //     const data = await response.json();

  //       if (!response.ok) {
  //           setLoading(false)
  //           //console.log(data.message)
  //           setError("Tên đăng nhập hoặc mật khẩu không đúng.");
  //           return;
  //     }

  //     // Đăng nhập thành công
  //     setSuccess("Đăng nhập thành công")
  //     setLoading(false)

  //     setTimeout(() => {
  //       navigate("/");
  //     }, 2000);

  //     // Ví dụ lưu token vào localStorage nếu backend trả token
  //     // localStorage.setItem("token", data.token);

  //     setState({ name: "", password: "" });
  //     setError("");

  //   } catch (err) {
  //     setLoading(false)
  //     //console.error(err);
  //     setError("Lỗi kết nối đến máy chủ.");
  //   }
  // };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, password } = state;

    if (!name || !password) {
      setError(t('error_fill_info'));
      return;
    }

    if (password.length < 8) {
      setLoading(false)
      setError(t('error_password_length'));
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(name, password);

    setLoading(false);

    if (result.isSuccess) {
      setSuccess(t('login_success'));
      setState({ name: "", password: "" });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setError(result.message);
    }
    // try {
    //   const res = await axiosInstance.post("/auth/login", { username: name, password: password });
    //   //console.log('Cookies:', document.cookie);
    //   const data = res.data;
    //   if (data.isSuccess)
    //   {
    //     setSuccess("Đăng nhập thành công");
    //     setLoading(false);

    //     setTimeout(() => {
    //       navigate("/discover");
    //     }, 1000);
    //     setState({ name: "", password: "" });
    //     setError("");
    //     const res = await axiosInstance.get("/auth/me");
    //     //console.log(res.data);
    //   }
    //   else {
    //     setLoading(false);
    //     //console.error("Login error:", err.response || err);
    //     setError(
    //       err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng."
    //     );
    //   }

    // } catch (err) {
    //   setLoading(false);
    //   //console.error("Login error:", err.response || err);
    //   setError(
    //     err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng."
    //   );
    // }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {loading && <LoadSpinner />}
      <div className={`${styles.formContainer} ${styles.signInContainer}`}>
        <form className={styles.inputForm} onSubmit={handleOnSubmit}>
          <h1>{t('login_title')}</h1>
          <input
            type="name"
            placeholder={t('username_placeholder')}
            name="name"
            value={state.name}
            onChange={handleChange}
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t('password_placeholder')}
              value={state.password}
              onChange={handleChange}
            />
            <button
              type="button" // Quan trọng: Tránh submit form
              className={styles.eyeButton}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (<small style={{ color: "red", marginTop: "4px", fontSize: "12px" }}>{error}</small>)}
          {success && (<small style={{ color: "#33CC00", marginTop: "4px", marginBottom: "10px", fontSize: "12px" }}>{success}</small>)}
          {/* <a href="#">Quên mật khẩu?</a> */}
          <button className={styles['submit-btn']}>{t('login_btn')}</button>
        </form>
      </div>
    </>
  );
}

export default SignInForm;
