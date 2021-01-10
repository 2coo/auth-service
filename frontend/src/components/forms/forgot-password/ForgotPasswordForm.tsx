import { Box, Hidden } from "@material-ui/core"
import { Link, Redirect, useLocation } from "@reach/router"
import { Alert, Button, Col, Form, Input, Row, Typography } from "antd"
import queryString from "query-string"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import resetPasswordStyles from '../../../assets/jss/view/resetPasswordStyles'
import { useAxios } from "../../../utils/api"
import { formatQueryString } from "../../../utils/format"

const { Title } = Typography
const FormItem = Form.Item

const ResetPasswordForm = () => {
    const classes = resetPasswordStyles()
    const location = useLocation()
    const queryParams = queryString.parse(location.search)
    const [form] = Form.useForm();
    const [{
        data: resetPasswordData,
        loading: resetPasswordLoading,
        error: resetPasswordError
    }, resetPassword] = useAxios({
        url: '/oauth2/forgot',
        method: 'POST',
    }, {
        manual: true
    })
    const handleOk = () => {
        resetPassword({
            data: form.getFieldsValue(),
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
    }
    return (
        <Fragment>
            <Helmet>
                <title>Forgot your password</title>
            </Helmet>
            <div className={classes.form}>
                <Row justify='center'>
                    <Title className={classes.title} level={3}>Forgot your <Hidden smUp><br /></Hidden>password?</Title>
                </Row>
                {(resetPasswordError && resetPasswordError?.response?.status !== 403) && <Row gutter={[0, 32]}>
                    <Col span={24}>
                        <Alert message={resetPasswordError.response?.data?.message} type="error" showIcon closable />
                    </Col>
                </Row>}
                {
                    resetPasswordData?.data?.is_sent && <Redirect to={`${location.pathname === '/login/forgot' ? '/login/recover' : '/oauth2/recover'}${formatQueryString(queryParams)}`} />
                }
                <Form layout="vertical" initialValues={{ remember_me: true }} onFinish={handleOk} form={form}>
                    <FormItem label="Email"
                        validateStatus={resetPasswordError?.response?.status === 403 ? 'error' : ''}
                        help={resetPasswordError?.response?.status === 403 ? resetPasswordError.response?.data?.message : null}>
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
                    <Row>
                        <Button
                            size="large"
                            className={classes.button}
                            type="primary"
                            htmlType="submit"
                            loading={resetPasswordLoading}
                        >
                            Send me the link
                        </Button>
                    </Row>
                </Form>
                <Box mt={2} mb={12}>
                    <Row justify="center">
                        <Link to={`${location.pathname === "/login/forgot" ? '/login' : '/oauth2/authorize'}${formatQueryString(queryParams)}`}>
                            Back to Sign In
                        </Link>
                    </Row>
                </Box>
            </div>
        </Fragment>
    )
}

export default ResetPasswordForm
