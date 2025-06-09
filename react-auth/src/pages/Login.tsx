import {NavLink, useNavigate} from "react-router";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLogin } from '../hooks/useLogin.ts';

export default function Login () {
    const [ email, setEmail ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const { toLogin, loading, error } = useLogin();

    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await toLogin(email, password)

        if(response) {
            setTimeout(() => {
                navigate("/")
            }, 500)
        }
    }

    return (
        <div className="Login">
            <h1>Страница авторизации</h1>
            <div>
                {loading && <p>Загрузка...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <form action="#" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="email"
                        value = {email}
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) } }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        name="password"
                        type="text"
                        placeholder="пароль"
                        value={password}
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) } }
                    />
                </div>

                <button className="button mr-1em" type="submit">
                    Войти
                </button>

                <NavLink className="button" to="/register">
                    Регистрация
                </NavLink>
            </form>
        </div>
    )
}
