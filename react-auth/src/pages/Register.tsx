import {NavLink, useNavigate} from 'react-router'
import {type ChangeEvent, type FormEvent, useState} from "react";
import {useRegister} from "../hooks/useRegister.ts";

export default function Register () {
    const [ email, setEmail ] = useState<string>("")
    const [ name, setName ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const { toRegister, loading, error } = useRegister();

    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await toRegister(email, password, name)

        if(response) {
            setTimeout(() => {
                navigate("/")
            }, 500)
        }
    }

    return (
        <div className="Register">
            <h1>Страница регистрация</h1>
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
                    <label htmlFor="name">Имя</label>
                    <input
                        id="name"
                        name="name"
                        type="name"
                        required
                        placeholder="name"
                        value = {name}
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value) } }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        name="password"
                        type="text"
                        placeholder="пароль"
                        value = {password}
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) } }
                    />
                </div>

                {/*<div className="form-group">*/}
                {/*    <label htmlFor="confirmPassword">Повторите пароль</label>*/}
                {/*    <input id="confirmPassword" name="confirmPassword" type="text" placeholder="повторите пароль" />*/}
                {/*</div>*/}

                <button className="button mr-1em" type="submit">
                    Зарегистрироваться
                </button>
                <NavLink className="button" to="/login">
                    Войти
                </NavLink>

            </form>
        </div>
    )
}
