import { Link } from "@reach/router";
import { Alert, Avatar, Button, Checkbox, Col, Divider, Form, Input, Layout, Row, Space, Typography } from "antd";
import React, { FormEvent, Fragment, useRef, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { StringParam, useQueryParam } from "use-query-params";
import loginStyles from "../../assets/jss/view/loginStyles";
import { useAxios } from "../../utils/api";
import PROVIDERS from "../../components/providers"
import queryString from "querystring"
import { Carousel } from 'antd';
import clsx from "clsx";
import Logo from '../../assets/img/Logo/Asset 10@300x.png'
import { Box } from "@material-ui/core";
import { formatQueryString } from "../../utils/format";

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
          <Col xs={0} md={0} lg={12} xl={12} xxl={12} className={classes.leftPanel}>
            <Carousel autoplay autoplaySpeed={3500}>
              <div>
                <div className={clsx(classes.contentStyle)}>
                  <div className={classes.innerSlide}>
                    <img src="https://app.startinfinity.com/img/register/workflow-image.png" alt="worflo" />
                  </div>
                </div>
              </div>
              <div>
                <div className={clsx(classes.contentStyle)}>
                  <div className={classes.innerSlide}>
                    <img src="https://app.startinfinity.com/img/register/workflow-image.png" alt="worflo" />
                  </div>
                </div>
              </div>
              <div>
                <div className={clsx(classes.contentStyle)}>
                  <div className={classes.innerSlide}>
                    <img src="https://app.startinfinity.com/img/register/workflow-image.png" alt="worflo" />
                  </div>
                </div>
              </div>
              <div>
                <div className={clsx(classes.contentStyle)}>
                  <div className={classes.innerSlide}>
                    <img src="https://app.startinfinity.com/img/register/workflow-image.png" alt="worflo" />
                  </div>
                </div>
              </div>
            </Carousel>
          </Col>
          <Col xs={24} md={24} lg={12} xl={12} xxl={12} className={classes.rightPanel}>
            <Row align="middle" justify="center" style={{ height: "100%", }}>
              <Col className={classes.form}>
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
                      placeholder={`Username`}
                    />
                  </FormItem>
                  <FormItem name="password"
                    rules={[{ required: true, message: 'Please input email or username!' }]} hasFeedback>
                    <Input
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
                      <Text type="secondary">Don't have an account yet? <Link to={`/signup${formatQueryString(queryString.stringify(queryParams))}`}>Register now</Link></Text>
                    </Row>
                  </Space>
                  <Divider plain>OR</Divider>
                  <Row justify="center">
                    {providers?.data.map((provider: 'GOOGLE') => {
                      const ProviderButton = PROVIDERS?.[provider];
                      const _queryParams = { ...queryParams }
                      _queryParams["identity_provider"] = provider
                      return <a key={provider} href={`/oauth2/authorize${formatQueryString(queryString.stringify(_queryParams))}`}><ProviderButton /></a>
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
