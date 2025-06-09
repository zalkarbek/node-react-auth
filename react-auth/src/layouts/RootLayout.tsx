
import { NavLink, Outlet } from 'react-router'

export default function RootLayout () {
    return (
        <div className="RootLayout">
            <nav className="root-layout__nav">
                <NavLink to="/" end>Главная</NavLink>
                <NavLink to="/about" end>О нас</NavLink>
                <NavLink to="/profile" end>Профиль</NavLink>
                <NavLink to="/logout" end>Выйти</NavLink>
                <NavLink to="/register" end>Регистрация</NavLink>
                <NavLink to="/login" end>Войти</NavLink>
            </nav>
            <Outlet/>
        </div>
    )
}
