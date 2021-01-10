import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Box } from "@material-ui/core";
import { Link, useLocation } from "@reach/router";
import { Alert, Avatar, Button, Checkbox, Col, Divider, Form, Input, Row, Space, Spin, Typography } from "antd";
import queryString from "query-string";
import { FormEvent, Fragment, PropsWithChildren, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { StringParam, useQueryParam } from "use-query-params";
import Logo from '../../../assets/img/Logo/Asset 10@300x.png';
import loginStyles from "../../../assets/jss/view/loginStyles";
import { useAxios } from "../../../utils/api";
import { formatQueryString } from "../../../utils/format";
import IDENTITY_PROVIDERS from "../../identity-providers";

const FormItem = Form.Item
const { Text } = Typography

interface Props extends PropsWithChildren<any> {
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const LoginForm = ({ }: Props) => {
    const classes = loginStyles();
    const location = useLocation()
    const [clientId,] = useQueryParam('client_id', StringParam);
    const [error,] = useQueryParam('error', StringParam)
    const [submitting, setSubmitting] = useState(false)
    const [fields, setFields] = useState<any[]>([]);
    const [form] = Form.useForm();
    const formHiddenEl = useRef<HTMLFormElement | undefined | null>()
    const [{ data: providers,
        loading: loadingProviders,
        error: errorProviders
    }, getProviders] = useAxios({
        url: '/oauth2/providers',
        method: "GET", params: { client_id: clientId }
    })
    const handleOk = (e: FormEvent<HTMLFormElement>) => {
        formHiddenEl.current?.submit()
    }
    const queryParams = queryString.parse(location.search)
    return (
        <Fragment>
            <Helmet>
                <title>Login</title>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Helmet>
            <div className={classes.form}>
                {error && <Row gutter={[0, 32]}>
                    <Col span={24}>
                        <Alert message={atob(error)} type="error" showIcon closable />
                    </Col>
                </Row>}
                <Box mb={4}>
                    <Row justify="center" gutter={[0, 32]} align="middle">
                        <Space>
                            <Avatar size={40} shape="square" src={Logo} />
                            <span className={classes.company}>TOMUJIN DIGITAL</span>
                        </Space>
                    </Row>
                </Box>
                <Form initialValues={{ remember_me: true }} onFinish={handleOk} form={form} onFieldsChange={(changedFields, allFields) => {
                    setFields(allFields)
                }}>
                    <FormItem name="username"
                        rules={[{ required: true, message: 'Please input email or username!' }]} hasFeedback>
                        <Input
                            size="large"
                            prefix={<UserOutlined className={classes.inputIcon} />}
                            placeholder={`Username or Email`}
                        />
                    </FormItem>
                    <FormItem name="password"
                        rules={[{ required: true, message: 'Please input email or username!' }]} hasFeedback>
                        <Input
                            prefix={<LockOutlined className={classes.inputIcon} />}
                            size="large"
                            type="password"
                            placeholder={`Password`}
                        />
                    </FormItem>
                    <Form.Item>
                        <Form.Item name="remember_me" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link className={classes.loginFormForgot} to="/password/new">
                            Forgot password?
                            </Link>
                    </Form.Item>
                    <Space size={15} direction="vertical" style={{
                        width: "100%"
                    }}>
                        <Row>
                            <Button
                                size="large"
                                className={classes.button}
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                            >
                                Log in
                            </Button>
                        </Row>
                        <Row justify="center">
                            <Text type="secondary">Don't have an account yet? <Link to={`${location.pathname === '/login' ? '/signup' : '/oauth2/register'}${formatQueryString(queryParams)}`}>Register now</Link></Text>
                        </Row>
                    </Space>
                    <Row justify="center">
                        {providers?.data.length > 0 && <Divider plain>OR</Divider>}
                        {loadingProviders ? <Spin indicator={antIcon} /> : providers?.data.map((provider: 'GOOGLE') => {
                            const ProviderButton = IDENTITY_PROVIDERS?.[provider];
                            const _queryParams = { ...queryParams }
                            _queryParams["identity_provider"] = provider
                            return <a key={provider} href={`/oauth2/authorize${formatQueryString(_queryParams)}`}><ProviderButton /></a>
                        })}
                    </Row>
                </Form>
                <form ref={(el) => formHiddenEl.current = el} method="post" onSubmit={() => setSubmitting(true)}>
                    {
                        fields.map((field) => <input key={field.name[0]} name={field.name[0]} value={field.value} type="hidden" />)
                    }
                </form>
            </div>
        </Fragment >
    )
}

export default LoginForm
