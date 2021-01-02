import { Layout } from 'antd';
import { Fragment, PropsWithChildren } from "react";
import layoutStyle from "../../../assets/jss/layout/layoutStyles";
import SiderMenu from '../menu/Menu';

interface Props extends PropsWithChildren<any> {
    isMobile: boolean
    collapsed?: boolean
    onCollapseChange: (collapse: boolean) => void,
    menus: any[] | undefined
}
const Sider = ({
    isMobile = false,
    collapsed = false,
    onCollapseChange,
    menus = []
}: Props) => {
    const classes = layoutStyle()
    return (
        <Fragment>
            <Layout.Sider
                onBreakpoint={!isMobile ? onCollapseChange : () => { }}
                className={classes.sider}
                width={256} trigger={null} collapsible collapsed={collapsed} >
                <div className={classes.logo} />
                <SiderMenu menus={menus} collapsed={collapsed} isMobile={isMobile} onCollapseChange={onCollapseChange} />
            </Layout.Sider>
        </Fragment>
    )
}
export default Sider
