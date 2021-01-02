import { Fragment } from "react"
import { Menu } from "antd"
import SubMenu from "antd/lib/menu/SubMenu"
import { PropsWithChildren } from "react"
import { Routes } from "../../../models/Routes"
import { Link } from "@reach/router"
import { useLocation } from "@reach/router";
import { getParent } from "../../../utils/route";
interface Props extends PropsWithChildren<any> {
    menus: any[],
    collapsed: boolean,
    isMobile: boolean,
    onCollapseChange: (collapse: boolean) => void
}
const SiderMenu = ({
    collapsed,
    isMobile = false,
    onCollapseChange,
    menus
}: Props) => {
    const location = useLocation()
    const parentRoute = getParent(menus, location.pathname)
    const generateMenus = (routes: Routes[]) => {
        return routes.map(route => {
            if (route.subroutes) {
                return (<SubMenu
                    key={route.path}
                    title={
                        <Fragment>
                            <span>{route.name}</span>
                        </Fragment>
                    }
                    icon={route.icon}
                >
                    {generateMenus(route.subroutes)}
                </SubMenu>)
            }
            return (
                <Menu.Item key={route.path} icon={route.icon}>
                    <Link to={route.path === "/" ? "" : route.path}>
                        <span>{route.name}</span>
                    </Link>
                </Menu.Item>
            )
        })
    }
    const defaultSelectedKeys = [location.pathname]
    const defaultOpenKeys = parentRoute?.path ? [parentRoute.path] : []
    return (
        <Menu defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} theme="dark" mode="inline"
            onClick={isMobile ? () => {
                onCollapseChange(true)
            } : undefined}>
            {generateMenus(menus)}
        </Menu>
    )
}

export default SiderMenu
