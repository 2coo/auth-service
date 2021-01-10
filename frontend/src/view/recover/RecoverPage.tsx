import { Fragment } from 'react';
import { Row, Space, Typography } from 'antd'
import { Helmet } from 'react-helmet-async'
import { Link } from '@reach/router'
import recoverPageStyles from '../../assets/jss/view/recoverPageStyles'
import { formatQueryString } from '../../utils/format';
import queryString from 'query-string'
import clsx from 'clsx';
import { Box } from '@material-ui/core';

const { Title, Text } = Typography
const RecoverPage = ({ location }: any) => {
    const classes = recoverPageStyles()
    const queryParams = queryString.parse(location.search)
    return (
        <Fragment>
            <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
                <Helmet>
                    <title>Recover</title>
                </Helmet>
                <div className={classes.form}>
                    <Row justify='center'>
                        <Text className={classes.title}>Welcome back!</Text>
                    </Row>
                    <Row justify="center">
                        <img className={classes.svgImage} alt='Paper plane' src='/img/svg/paper-plane.svg' />
                    </Row>
                    <Box marginTop={3}>
                        <Row justify='center'>
                            <Space direction='vertical' align="center">
                                <Text className={classes.BigDescription}>
                                    Recovery link sent
                            </Text>
                                <Text className={classes.SpacedText}>
                                    go to your inbox
                            </Text>
                                <Text className={classes.SpacedText}>
                                    or <Link to={`${location.pathname === '/login/recover' ? '/login' : '/oauth2/authorize'}${formatQueryString(queryParams)}`}>Sign In</Link>
                                </Text>
                            </Space>
                        </Row>
                    </Box>
                </div>
            </Row>
        </Fragment >
    )
}

export default RecoverPage
