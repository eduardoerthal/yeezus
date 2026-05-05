import React, { useReducer } from "react";
import "../styles/Cadastro.css";
import userService from "../api/userService";

function Cadastro_resto() {

  const initialState = { 
    nome: "",
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

    // 🔒 validação simples
    if (!state.nome || !state.email || !state.senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await userService.createUser(state);
      alert("Usuário cadastrado com sucesso!");

      // limpa o form
      dispatch({
        type: "update",
        data: { nome: "", email: "", senha: "" }
      });

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Vamos continuar seu cadastro!</h1>
        <p>Preencha os campos abaixo</p>

        <input
          className="campo"
          type="text"
          name="nome"
          placeholder="Nome"
          value={state.nome}
          onChange={handleChange}
        />

        <input
          className="campo"
          type="email"
          name="email"
          placeholder="E-mail"
          value={state.email}
          onChange={handleChange}
        />

        <input
          className="campo"
          type="password"
          name="senha"
          placeholder="Senha"
          value={state.senha}
          onChange={handleChange}
        />

        <button className="botao" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cadastro_resto;