import { Fragment } from 'react';
import { Row } from 'antd'
import ResetPasswordForm from '../../components/forms/forgot-password/ForgotPasswordForm'

const ResetPassword = ({ location }: any) => {
    return (
        <Fragment>
            <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
                <ResetPasswordForm />
            </Row>
        </Fragment >
    )
}

export default ResetPassword
