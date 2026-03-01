import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoadSpinner from "../LoadSpinner/LoadSpinner"
import authService from "../../services/authService"
import emailValidationService from "../../services/emailValidationService";
import { Eye, EyeOff } from "lucide-react";
import styles from "./SignUp.module.css";

function SignUpForm({ activeType }) {
    const { t } = useTranslation();
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
            setLoading(false);
            setError(t('error_fill_info'));
            return false;
        }

        if (password.length < 8) {
            setLoading(false)
            setError(t('error_password_length'));
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const emailValidation = await emailValidationService.validateEmail(email);


        if (!emailValidation.isFormatValid) {
            setLoading(false);
            setError(emailValidation.message || t('error_email_format'))
            return;
        }

        if (!emailValidation.isDeliverable) {
            setLoading(false);
            setError(emailValidation.message || t('error_email_invalid'));
            return;
        }

        if (!emailValidation.isGmail) {
            setLoading(false);
            setError(t('error_email_gmail'));
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
            setSuccess(t('register_success'));
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
                    <h1>{t('register_title')}</h1>
                    <input
                        type="text"
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                        placeholder={t('username_placeholder')}
                    />
                    <input
                        type="email"
                        name="email"
                        value={state.email}
                        onChange={handleChange}
                        placeholder={t('email_placeholder')}
                    />
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={state.password}
                            onChange={handleChange}
                            placeholder={t('password_placeholder')}
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                    {error && (<small style={{ color: "red", marginTop: "4px", marginBottom: "10px", fontSize: "12px" }}>{error}</small>)}
                    {success && (<small style={{ color: "#33CC00", marginTop: "4px", marginBottom: "10px", fontSize: "12px" }}>{success}</small>)}
                    <button className={styles['submit-btn']}>{t('register_btn')}</button>
                </form>
            </div>
        </>
    );
}

export default SignUpForm;
