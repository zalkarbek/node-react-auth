import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'

import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'

import RootLayout from './layouts/RootLayout'
import AuthLayout from './layouts/AuthLayout.tsx'

import { AppContextProvider } from './context/AppContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
<StrictMode>
    <AppContextProvider>
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<RootLayout />}>

                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />

                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    </AppContextProvider>
</StrictMode>,
)
