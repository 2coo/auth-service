import { Fragment } from 'react';
import RegisterForm from "../../components/forms/register/RegisterForm";
import { Row } from 'antd'

const SignUpPage = ({ location }: any) => {
  return (
    <Fragment>
      <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
        <RegisterForm />
      </Row>
    </Fragment >
  )
}

export default SignUpPage
