import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from '@ant-design/icons'
import { Box } from "@material-ui/core"
import { Link, useLocation } from "@reach/router"
import { Alert, Button, Col, Form, Input, Row, Spin, Typography } from "antd"
import queryString from "querystring"
import { Fragment } from "react"
import registerStyles from '../../../assets/jss/view/registerStyles'
import { useAxios } from "../../../utils/api"
import { formatQueryString } from "../../../utils/format"
import FullRedirect from "../../full-redirect/FullRedirect"
import { Helmet } from "react-helmet-async";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Title } = Typography
const FormItem = Form.Item

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
            <Helmet>
                <title>Sign Up</title>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Helmet>
            <div className={classes.form}>
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
            </div>
        </Fragment>
    )
}

export default RegisterForm
