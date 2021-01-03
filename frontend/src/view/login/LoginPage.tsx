import { Link } from "@reach/router";
import { Alert, Button, Checkbox, Col, Divider, Form, Input, Layout, Row, Space, Typography } from "antd";
import React, { FormEvent, Fragment, useRef, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { StringParam, useQueryParam } from "use-query-params";
import loginStyles from "../../assets/jss/view/loginStyles";
import { useAxios } from "../../utils/api";
import PROVIDERS from "../../components/providers"
import queryString from "querystring"

const { Content } = Layout;
const { Title, Text } = Typography;
const FormItem = Form.Item

const LoginPage = ({ location }: any) => {
  const classes = loginStyles();
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
  const queryParams = queryString.parse(location.search.substr(1))
  return (
    <Fragment>
      <Helmet>
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
      </Helmet>
      <Content className={classes.wrapper}>
        <Row className={classes.container}>
          <Col xs={0}  md={0} lg={12} xl={14} xxl={16} className={classes.leftPanel}>
          </Col>
          <Col xs={24} md={24} lg={12} xl={10} xxl={8} className={classes.rightPanel}>
            <Row align="middle" justify="center" className={classes.padding}>
              <Col span={24}>
                {error && <Row gutter={[0, 32]}>
                  <Col span={24}>
                    <Alert message={atob(error)} type="error" showIcon closable />
                  </Col>
                </Row>}
                <Row justify="center" gutter={[0, 32]}>
                  <Title level={4}>Login to your account</Title>
                </Row>
                <Form initialValues={{ remember_me: true }} onFinish={handleOk} form={form} onFieldsChange={(changedFields, allFields) => {
                  setFields(allFields)
                }}>
                  <FormItem name="username"
                    rules={[{ required: true, message: 'Please input email or username!' }]} hasFeedback>
                    <Input
                      placeholder={`Username`}
                    />
                  </FormItem>
                  <FormItem name="password"
                    rules={[{ required: true, message: 'Please input email or username!' }]} hasFeedback>
                    <Input
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
                        className={classes.button}
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        Log in
                      </Button>
                    </Row>
                    <Row justify="center">
                      <Text type="secondary">Don't have an account yet? <Link to="/signup">Register now</Link></Text>
                    </Row>
                  </Space>
                  <Divider plain>OR</Divider>
                  <Row justify="center">
                    {providers?.data.map((provider: 'GOOGLE') => {
                      const ProviderButton = PROVIDERS?.[provider];
                      queryParams["identity_provider"] = provider
                      return <a key={provider} href={`/oauth2/authorize?${queryString.stringify(queryParams)}`}><ProviderButton /></a>
                    })}
                  </Row>
                </Form>
                <form ref={(el) => formHiddenEl.current = el} method="post" onSubmit={() => setSubmitting(true)}>
                  {
                    fields.map((field) => <input key={field.name[0]} name={field.name[0]} value={field.value} type="hidden" />)
                  }
                </form>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* <Row justify="center">
          <Col span={24}>
            <footer className={classes.footer}>Tomujin Digital ©2020</footer>
          </Col>
        </Row> */}
      </Content >
    </Fragment >
  )
}

export default LoginPage
