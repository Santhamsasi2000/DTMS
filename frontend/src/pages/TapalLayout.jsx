import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar"

const TapalLayout = () => {
  return (
    <section className="flex">
      {/* SideBar */}
      <div className="fixed w-64 left-0 top-0 h-screen">
        <SideBar/>
      </div>
      <div className="ml-64 flex-1 min-h-screen">
        <Outlet/>
      </div>
    </section>
  )
}

export default TapalLayout
