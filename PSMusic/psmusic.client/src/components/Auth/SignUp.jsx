import { React, useState, useEffect } from "react";
import LoadSpinner from "../LoadSpinner/LoadSpinner"
import authService from "../../services/authService"
import emailValidationService from "../../services/emailValidationService";
import { Eye, EyeOff } from "lucide-react";
import styles from "./SignUp.module.css";

function SignUpForm({ activeType }) {
  const [state, setState] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setState({ name: "", email: "", password: "" });
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

    const handleOnSubmit = async evt => {
        setLoading(true)
        evt.preventDefault();

        const { name, email, password } = state;

        if (!name || !email || !password) {
            setError("Vui lòng điền đầy đủ thông tin");
            return false;
        }

        if (password.length < 8) {
            setLoading(false)
            setError("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const emailValidation = await emailValidationService.validateEmail(email);
        

        if (!emailValidation.isFormatValid) {
            setLoading(false);
            setError(emailValidation.message || "Format email không hợp lệ")
            return;
        }

        if (!emailValidation.isDeliverable) {
            setLoading(false);
            setError(emailValidation.message || "Email không tồn tại hoặc không hợp lệ");
            return;
        }
        
        if (!emailValidation.isGmail) {
            setLoading(false);
            setError("Chỉ chấp nhận mail có đuôi @gmail.com");
            return;
        }

        const result = await authService.register({
            username: name,
            password: password,
            email: email,
            displayName: name,
            avatarURL: null
        });

        setLoading(false);

        if (result.isSuccess) {
            setSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
            setState({ name: "", email: "", password: "" });
        } else {
            setError(result.message);
        }
        // try {
        //     const response = await fetch("https://localhost:7215/api/auth/register", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ username: name, password: password, email: email, displayName: name, avatarURL: null })
        //     });
        //     const data = await response.json();

        //     if (!response.ok) {
        //         setLoading(false)
        //         setError(data.message);
        //         return;
        //     }

        //     setLoading(false)
        //     setSuccess("Đăng ký thành công")
        //     setState({ name: "", email: "", password: "" });
        //     setError("");

        // } catch (err) {
        //     setLoading(false)
        //     //console.error(err);
        //     setError("Lỗi kết nối đến máy chủ.");
        // };
    }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <>
          {loading && <LoadSpinner />}
          <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
              <form className={styles.inputForm} onSubmit={handleOnSubmit}>
                  <h1>Tạo tài khoản</h1>
                  <input
                      type="text"
                      name="name"
                      value={state.name}
                      onChange={handleChange}
                      placeholder="Tên đăng nhập"
                  />
                  <input
                      type="email"
                      name="email"
                      value={state.email}
                      onChange={handleChange}
                      placeholder="Email"
                  />
                  <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={state.password}
                        onChange={handleChange}
                        placeholder="Mật khẩu"
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                  {error && (<small style={{ color: "red", marginTop: "4px", marginBottom: "10px", fontSize: "12px" }}>{error}</small>)}
                  {success && (<small style={{ color: "#33CC00", marginTop: "4px", marginBottom: "10px", fontSize: "12px" }}>{success}</small>)}
                  <button className={styles['submit-btn']}>Đăng ký</button>
              </form>
          </div>
      </>
  );
}

export default SignUpForm;
