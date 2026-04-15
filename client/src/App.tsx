import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./Routes/AppRoutes"
import { SidebarProvider } from "./contexts/SidebarContext"

const App = () => {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SidebarProvider>
  )
}

export default App