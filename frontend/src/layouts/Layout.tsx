import { Layout } from 'antd';
import { Fragment, useState } from "react";
import { isMobile } from 'react-device-detect';
import layoutStyles from "../assets/jss/layout/layoutStyles";
import Header from "../components/layout/header/Header";
import Sider from "../components/layout/sider/Sider";
import routes from "../routes";
import { formatRoutes } from "../utils/route";


const { Content, Footer } = Layout;

const App = ({
  children,
  location
}: any) => {
  const classes = layoutStyles()
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => {
    setCollapsed(!collapsed)
  }
  const onCollapseChange = (collapse: boolean) => { }
  const appMenus = formatRoutes(routes).find(route => route.isProtected === true)!.subroutes!.filter(route => route.isSiderMenu === true)
  console.log(appMenus);
  return (
    <Fragment>
      <Layout>
        <Sider menus={appMenus} isMobile={isMobile} collapsed={collapsed} onCollapseChange={onCollapseChange} />
        <Layout style={{
          paddingTop: true ? 72 : 0
        }} className={classes.primaryLayout}>
          <Header collapsed={collapsed} toggle={toggle} />
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Tomujin Digital ©2020</Footer>
        </Layout>
      </Layout>
    </Fragment>
  )
};

export default App;
