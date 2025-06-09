import { Outlet } from 'react-router'

export default function AuthLayout () {
    return (
        <>
            <div className="AuthLayout center">
                <Outlet />
            </div>
        </>
    )
}
