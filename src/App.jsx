import root from "./router/root.jsx"
import './App.css'
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";
import axios from "axios";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

function App() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={root}/>
            </QueryClientProvider>
        </>
    )
}

export default App
