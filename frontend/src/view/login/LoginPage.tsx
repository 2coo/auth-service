import { Fragment } from 'react';
import LoginForm from "../../components/forms/login/LoginForm";
import { Row } from 'antd'

const LoginPage = ({ location }: any) => {
  return (
    <Fragment>
      <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
        <LoginForm />
      </Row>
    </Fragment >
  )
}

export default LoginPage
