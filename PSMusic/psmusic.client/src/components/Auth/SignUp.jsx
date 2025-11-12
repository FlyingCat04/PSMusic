import { React, useState } from "react";
function SignUpForm() {
  const [state, setState] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

    const handleOnSubmit = async evt => {
        evt.preventDefault();

        const { name, email, password } = state;
        try {
            const response = await fetch("https://localhost:7215/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: name, password: password, email: email, displayName: name, avatarURL: null })
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message)
                setError(data.message);
                return;
            }

            setState({ name: "", email: "", password: "" });
            setError("");

        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối đến máy chủ.");
        };
    }

  return (
    <div className="formContainer signUpContainer">
      <form className="form" onSubmit={handleOnSubmit}>
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
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
        />
        {error && (<small style={{ color: "red", marginTop: "4px", fontSize: "12px" }}>{error}</small>)}
        <button className="submit-btn">Đăng ký</button>
      </form>
    </div>
  );
}

export default SignUpForm;
