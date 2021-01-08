
import { Box, Container } from "@material-ui/core";
import { Avatar, Col, Layout, Row, Typography } from "antd";
import { Fragment } from "react";
import { Link } from '@reach/router';
import Logo from "../../../assets/img/Logo/Asset 10@300x.png";
import simpleLayoutStyles from "../../../assets/jss/layout/simpleLayoutStyles";

const { Header, Content, Footer } = Layout;
const { Text } = Typography
const SimpleLayout = ({ children }: any) => {
    const classes = simpleLayoutStyles()
    return (
        <Fragment>
            <Layout className={classes.Layout}>
                <Header className={classes.Header}>
                    <Container>
                        <div className={classes.Logo}>
                            <Row align="middle" gutter={[8, 0]}>
                                <Col>
                                    <Avatar src={Logo} shape="square" />
                                </Col>
                                <Col>
                                    <Text className={classes.Company}>
                                        <Link to='/'>
                                            TOMUJIN DIGITAL
                                        </Link>
                                    </Text>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </Header>
                <Content className={classes.Content}>
                    <Container>{children}</Container>
                </Content>
                <Box>
                    <Footer className={classes.Footer}>
                        <Container>
                            Tomujin Digital 2021
                        </Container>
                    </Footer>
                </Box>
            </Layout>
        </Fragment>
    )
}

export default SimpleLayout
