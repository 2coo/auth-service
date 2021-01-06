import { Alert, Col, Row, Typography, Spin, Form, Input, Button, message, Statistic, Result } from "antd"
import { Fragment, useEffect, useState } from "react"
import { useAxios } from "../../../utils/api"
import registerStyles from '../../../assets/jss/view/registerStyles'
import { Link, useLocation } from "@reach/router"
import queryString from "querystring"
import { formatQueryString } from "../../../utils/format"
import { LoadingOutlined } from '@ant-design/icons';
import { Box } from "@material-ui/core"
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import FullRedirect from "../../full-redirect/FullRedirect"
import moment from "moment"

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Title, Text } = Typography
const FormItem = Form.Item
const { Countdown } = Statistic;

const RegisterForm = () => {
    const classes = registerStyles()
    const location = useLocation()
    const [{ data, loading, error },] = useAxios({
        url: '/oauth2/register/get/fields',
        method: "POST"
    })
    const queryParams = queryString.parse(location.search)
    const [form] = Form.useForm();
    const [{
        data: registerData,
        loading: registerLoading,
        error: registerError
    }, register] = useAxios({
        url: `/oauth2/register`,
        method: 'POST',
        params: queryParams
    }, {
        manual: true,
    })
    const handleOk = () => {
        register({
            data: form.getFieldsValue(),
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
    }
    const EyeTwoToneIcon = <EyeTwoTone className={classes.inputIcon} />
    const EyeInvisibleOutlinedIcon = <EyeInvisibleOutlined className={classes.inputIcon} />
    return (
        <Fragment>
            <Row align="middle" justify="center" style={{ height: "100%", }}>
                <Col className={classes.form}>
                    <Row justify='center'>
                        <Title className={classes.title} level={3}>Sign Up</Title>
                    </Row>
                    {error && <Row gutter={[0, 32]}>
                        <Col span={24}>
                            <Alert message={error.response?.data.message} type="error" showIcon closable />
                        </Col>
                    </Row>}
                    {loading ? <Row justify="center"><Box p={3}><Spin indicator={antIcon} /></Box></Row> :
                        !error && (registerData?.success ? <FullRedirect url={`/oauth2/authorize${formatQueryString(queryParams)}`} /> : <Fragment>
                            <Form layout="vertical" initialValues={{ remember_me: true }} onFinish={handleOk} form={form}>
                                <FormItem label="Fullname">
                                    <FormItem name="fullname"
                                        messageVariables={{
                                            name: 'Fullname'
                                        }}
                                        noStyle
                                        required
                                        rules={[{ required: true, }]} hasFeedback>
                                        <Input
                                            name="Fullname"
                                            size="large"
                                            placeholder={`Brene Brown`}
                                        />
                                    </FormItem>
                                </FormItem>
                                <FormItem label="Email">
                                    <FormItem name="email"
                                        messageVariables={{
                                            name: 'Email'
                                        }}
                                        noStyle
                                        rules={[{ required: true, type: 'email', }]} hasFeedback>
                                        <Input
                                            name="email"
                                            size="large"
                                            placeholder={`example@site.com`}
                                        />
                                    </FormItem>
                                </FormItem>
                                <FormItem label="Choosing password">
                                    <FormItem name="password"
                                        messageVariables={{
                                            name: 'Password'
                                        }}
                                        noStyle
                                        rules={[{ required: true, message: 'Please input a password!' }]}>
                                        <Input.Password
                                            name='password'
                                            iconRender={visible => (visible ? EyeTwoToneIcon : EyeInvisibleOutlinedIcon)}
                                            size="large"
                                            type="password"
                                            placeholder={`•••••••••`}
                                        />
                                    </FormItem>
                                </FormItem>
                                <Row>
                                    <Button
                                        size="large"
                                        className={classes.button}
                                        type="primary"
                                        htmlType="submit"
                                        loading={registerLoading}
                                    >
                                        Sign Up
                                    </Button>
                                </Row>
                            </Form>
                        </Fragment>)
                    }
                    <Box mt={2} mb={12}>
                        <Row justify="center">
                            <Link to={`${location.pathname === "/signup" ? '/login' : '/oauth2/authorize'}${formatQueryString(queryParams)}`}>
                                Already have an account? Sign in
                            </Link>
                        </Row>
                    </Box>
                </Col>
            </Row>
        </Fragment>
    )
}

export default RegisterForm
