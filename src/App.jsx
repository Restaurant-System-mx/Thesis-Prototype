import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MenuPage from './pages/carta/MenuPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <MenuPage />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App