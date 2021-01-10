import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from '@ant-design/icons'
import { Box } from "@material-ui/core"
import { Link, useLocation } from "@reach/router"
import { Alert, Button, Col, Form, Input, Row, Spin, Typography } from "antd"
import queryString from "query-string"
import { Fragment } from "react"
import newPasswordStyles from '../../../assets/jss/view/newPasswordStyles'
import { useAxios } from "../../../utils/api"
import { formatQueryString } from "../../../utils/format"
import FullRedirect from "../../full-redirect/FullRedirect"
import { Helmet } from "react-helmet-async";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Title } = Typography
const FormItem = Form.Item

const NewPasswordForm = () => {
    const classes = newPasswordStyles()
    const location = useLocation()
    const queryParams = queryString.parse(location.search)
    const [form] = Form.useForm();
    const [{
        data: resetData,
        loading: resetLoading,
        error: resetError
    }, reset] = useAxios({
        url: `/oauth2/reset`,
        method: 'POST',
        params: queryParams
    }, {
        manual: true,
    })
    const handleOk = () => {
        reset({
            data: {
                token: queryParams.token,
                ...form.getFieldsValue()
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
    }
    return (
        <Fragment>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <div className={classes.form}>
                <Row justify='center'>
                    <Title className={classes.title} level={3}>Create New Password</Title>
                </Row>
                {resetError && <Row gutter={[0, 32]}>
                    <Col span={24}>
                        <Alert message={resetError.response?.data.message} type="error" showIcon closable />
                    </Col>
                </Row>}
                {(resetData?.success && resetData?.data?.returnTo) ? <FullRedirect url={resetData.data.returnTo} /> : <Fragment>
                    <Form layout="vertical" initialValues={{ remember_me: true }} onFinish={handleOk} form={form}>
                        <FormItem label="Choosing password" hasFeedback>
                            <FormItem name="password"
                                messageVariables={{
                                    name: 'Password'
                                }}
                                noStyle
                                rules={[{ required: true, message: 'Please input a password!' }]}>
                                <Input.Password
                                    visibilityToggle={false}
                                    name='password'
                                    size="large"
                                    type="password"
                                    placeholder={`Enter password`}
                                />
                            </FormItem>
                        </FormItem>
                        <FormItem label='Confirm' hasFeedback>
                            <FormItem
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                noStyle
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('The two passwords that you entered do not match!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder={`Confirm password`} visibilityToggle={false} size="large" />
                            </FormItem>
                        </FormItem>
                        <Row>
                            <Button
                                size="large"
                                className={classes.button}
                                type="primary"
                                htmlType="submit"
                                loading={resetLoading}
                            >
                                Create Password
                            </Button>
                        </Row>
                    </Form>
                </Fragment>}
                <Box mt={2} mb={12}>
                    <Row justify="center">
                        <Link to={`${location.pathname === "/login/reset" ? '/signup' : '/oauth2/register'}${formatQueryString(queryParams)}`}>
                            Don't have an account? Sign Up
                        </Link>
                    </Row>
                </Box>
            </div>
        </Fragment>
    )
}

export default NewPasswordForm
