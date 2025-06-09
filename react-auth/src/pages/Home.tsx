import { useState } from 'react'
import {useAppContext} from "../hooks/useAppContext.ts";

export default function Home() {
    const [count, setCount] = useState(0)
    const ctx = useAppContext();

    return (
        <>
            <h1>Добро пожаловать { ctx?.user?.name ?? 'Гость' }</h1>
            <div className="card">
                <button className="button" onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
        </>
    )
}
