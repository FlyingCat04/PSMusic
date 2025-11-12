import {React, useState} from "react";
function SignInForm() {
  const [state, setState] = useState({name: "", password: ""});
  const [error, setError] = useState("");

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
    setError("");
  };


  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { name, password } = state;

    // 🔹 Kiểm tra logic đăng nhập mẫu (bạn có thể thay bằng call API sau này)
    // if (name !== "admin" || password !== "123456") {
    //   setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    //   return;
    // }


    try {
        const response = await fetch("https://localhost:7215/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password: password })
      });

      const data = await response.json();

        if (!response.ok) {
            console.log(data.message)
        setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
        return;
      }

      // Đăng nhập thành công
      alert("Đăng nhập thành công!");
      console.log("Server response:", data);

      // Ví dụ lưu token vào localStorage nếu backend trả token
      // localStorage.setItem("token", data.token);

      setState({ name: "", password: "" });
      setError("");

    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ.");
    }
  };

  return (
    <div className="formContainer signInContainer">
      <form className="form" onSubmit={handleOnSubmit}>
        <h1>Đăng nhập</h1>
        <input
          type="name"
          placeholder="Tên đăng nhập"
          name="name"
          value={state.name}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={state.password}
          onChange={handleChange}
        />
        {error && (<small style={{ color: "red", marginTop: "4px", fontSize: "12px" }}>{error}</small>)}
        <a href="#">Quên mật khẩu?</a>
        <button className="submit-btn">Đăng nhập</button>
      </form>
    </div>
  );
}

export default SignInForm;
