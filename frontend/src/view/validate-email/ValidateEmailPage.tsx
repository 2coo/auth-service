import { LoadingOutlined } from '@ant-design/icons'
import { Box, Hidden, Link } from "@material-ui/core"
import { Button, Col, Row, Typography, Spin } from "antd"
import { Fragment, useState } from "react"
import ReactCodeInput from 'react-code-input'
import MailImage from '../../assets/img/pages/paper-plane.png'
import validateEmailStyles from "../../assets/jss/view/validateEmailStyles"
import SimpleLayout from '../../components/layout/simple-layout/SimpleLayout'
import { useAxios } from "../../utils/api"

const { Title, Text } = Typography
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const inputCodeStyles: any = {
    fontFamily: 'monospace',
    borderRadius: 6,
    border: '1px solid lightgrey',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 0px',
    margin: 4,
    paddingLeft: 8,
    paddingRight: 0,
    width: 46,
    height: 52,
    fontSize: 32,
    boxSizing: 'border-box',
    color: 'black',
    backgroundColor: 'white',
}

const inputCodeInvalidStyles: any = {
    fontFamily: 'monospace',
    borderRadius: 6,
    border: '1px solid rgb(238, 211, 215)',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 0px',
    margin: 4,
    paddingLeft: 8,
    paddingRight: 0,
    width: 46,
    height: 52,
    fontSize: 32,
    boxSizing: 'border-box',
    color: 'rgb(185, 74, 72)',
    backgroundColor: 'rgb(242, 222, 222)',
}

const ValidateEmailPage = () => {
    const classes = validateEmailStyles()
    const [code, setCode] = useState<string>('')
    const [{ data: infoData,
        loading: infoLoading,
        error: infoError }, getInfo] = useAxios({
            url: '/signup/validate-email/info',
            method: 'GET',
        })
    console.log(infoData);
    return (
        <Fragment>
            <SimpleLayout>
                <Row justify="center" align='middle' style={{
                    height: "100%"
                }}>
                    <div className={classes.Card}>
                        {
                            infoLoading ? <Row justify='center'><Spin indicator={antIcon} /></Row> : <Fragment>
                                <Row justify="center">
                                    <span className={classes.H2}>Let's go!</span>
                                </Row>
                                <Hidden smDown>
                                    <Row justify='center'>
                                        <Box mt={2}>
                                            <img className={classes.MailImg} alt='Mail' src={MailImage} />
                                        </Box>
                                    </Row>
                                </Hidden>
                                <Row>
                                    <span className={classes.boxWrapper}>
                                        <span className={classes.H3}>
                                            We just emailed you.
                                    </span>
                                        <Row>
                                            <Text type="secondary">Please enter the code we emailed you.</Text>
                                        </Row>
                                        <Row>
                                            <Text>giva9712@gmail.com</Text>
                                        </Row>
                                        <Row>
                                            <span className={classes.CodeConfirmationLabel}>
                                                <Text strong>Confirmation Code</Text>
                                            </span>
                                        </Row>
                                        <Row justify='center'>
                                            <span className={classes.CodeInputWrapper}>
                                                <ReactCodeInput onChange={(value) => setCode(value)}
                                                    className={classes.CodeInput}
                                                    name='code'
                                                    inputMode='numeric'
                                                    type='number'
                                                    fields={4}
                                                    isValid={code.length !== 4}
                                                    inputStyle={inputCodeStyles}
                                                    inputStyleInvalid={inputCodeInvalidStyles} />
                                            </span>
                                        </Row>
                                        <Row>
                                            <Button
                                                size="large"
                                                className={classes.button}
                                                type="primary"
                                                htmlType="submit"
                                            // loading={submitting}
                                            >
                                                Verify
                                    </Button>
                                        </Row>
                                        <Box mt={2}>
                                            <Row justify='center' gutter={[4, 0]}>
                                                <Col>
                                                    <Link>
                                                        Resend code
                                            </Link>
                                                </Col>
                                                <Col>
                                                    or
                                        </Col>
                                                <Col>
                                                    <Link href="/logout">
                                                        Logout
                                                </Link>
                                                </Col>
                                            </Row>
                                        </Box>
                                    </span>
                                </Row>
                            </Fragment>
                        }
                    </div>
                </Row>
            </SimpleLayout>
        </Fragment>
    )
}

export default ValidateEmailPage
