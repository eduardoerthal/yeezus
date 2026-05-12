import React, { useReducer } from "react";
import "../styles/Entrar.css";
import { Navbar } from "../components/Navbar.jsx";
import userService from "../api/userService";
import { useNavigate } from "react-router-dom";

function Entrar() {

  const navigate = useNavigate();

  const initialState = {
    email: "",
    senha: "",
  };

  function reducer(state, action) {

    switch (action.type) {

      case "update":
        return {
          ...state,
          ...action.data,
        };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {

    const { name, value } = e.target;

    dispatch({
      type: "update",
      data: { [name]: value },
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!state.email || !state.senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {

      const response = await userService.login({
        email: state.email,
        senha: state.senha,
      });

      if (response.status === 200) {

        localStorage.setItem("token", response.data);

        alert("Login realizado com sucesso!");

        dispatch({
          type: "update",
          data: {
            email: "",
            senha: "",
          },
        });

        navigate("/");
      }

    } catch (error) {

      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Erro ao realizar login");
      }

      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">

        <form className="form" onSubmit={handleSubmit}>

          <h1>Entrar</h1>

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={state.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={state.senha}
            onChange={handleChange}
          />

          <button type="submit">
            Entrar
          </button>

        </form>

      </div>
    </>
  );
}

export default Entrar;