import { Layout } from 'antd'
import { createElement, PropsWithChildren, Fragment, useState } from "react"
import clsx from "clsx"
import layoutStyles from "../../../assets/jss/layout/layoutStyles"
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    RightOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Menu, Avatar, Popover, List, Badge } from "antd";
import { AuthConsumer } from '../../../store/auth/context';
import Ellipsis from 'react-ellipsis-pjs';
import moment from 'moment';
import FullRedirect from "../../../components/full-redirect/FullRedirect";

const { SubMenu } = Menu

interface Props extends PropsWithChildren<any> {
    collapsed: boolean,
    toggle: () => void
}

const Header = ({ collapsed, toggle }: Props) => {
    const classes = layoutStyles()
    const handleClickMenu = () => { }
    const notifications: any = []
    const onAllNotificationsRead = () => { }
    const [logginOutEl, setLogginOutEl] = useState<JSX.Element | null>(null)
    const handleLogout = () => {
        setLogginOutEl(<FullRedirect url="/logout?logout_url=/logout" />)
    }
    const rightContent = [
        <AuthConsumer key="user">
            {auth => <Menu key="user" mode="horizontal" onClick={handleClickMenu}>
                <SubMenu
                    key="Avatar"
                    title={
                        <Fragment>
                            <span style={{ color: '#999', marginRight: 4 }}>
                                Hi
                            </span>
                            <span>{auth.state.user?.given_name}</span>
                            <Avatar style={{ marginLeft: 8 }} src={auth.state.user?.picture} />
                        </Fragment>
                    }
                >
                    <Menu.Item key="SignOut" onClick={handleLogout}>
                        {logginOutEl}
                        Sign out
                    </Menu.Item>
                </SubMenu>
            </Menu>}
        </AuthConsumer>,
    ]

    rightContent.unshift(
        <Popover
            placement="bottomRight"
            trigger="click"
            key="notifications"
            overlayClassName={classes.notificationPopover}

            content={
                <div className={classes.notification}>
                    <List
                        itemLayout="horizontal"
                        dataSource={notifications}
                        locale={{
                            emptyText: "You have viewed all notifications.",
                        }}
                        renderItem={(item: any, index) => (
                            <List.Item key={item.id + index} className={classes.notificationItem}>
                                <List.Item.Meta
                                    title={
                                        <Ellipsis text={item.title} lines={1} />

                                    }
                                    description={moment(item.date).fromNow()}
                                />
                                <RightOutlined style={{ fontSize: 10, color: '#ccc' }} />
                            </List.Item>
                        )}
                    />
                    {notifications.length ? (
                        <div
                            onClick={onAllNotificationsRead}
                            className={classes.clearButton}
                        >
                            Clear notifications
                        </div>
                    ) : null}
                </div>
            }
        >
            <Badge
                count={notifications.length}
                dot
                offset={[-10, 10]}
                className={classes.iconButton}
            >
                <BellOutlined className={classes.iconFont} />
            </Badge>
        </Popover>
    )

    return (
        <Layout.Header className={clsx(classes.header, {
            "fixed": true,
            "collapsed": collapsed
        })} >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: classes.trigger,
                onClick: toggle,
            })}
            <div className={classes.rightContainer}>{rightContent}</div>
        </Layout.Header>
    )
}
export default Header
