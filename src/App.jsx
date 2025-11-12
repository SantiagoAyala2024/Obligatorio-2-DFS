import './style.css'
import Registro from './components/pages/Registro'
import Login from './components/pages/Login'
import Dashboard from './components/pages/Dashboard'
import Contenedor from './components/dashboard/Contenedor'
import NoEncontrado from './components/dashboard/NoEncontrado'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/dashboard/ProtectedRoute'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Contenedor />}>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NoEncontrado />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" theme="colored" />
    </Provider>
  )
}

export default App