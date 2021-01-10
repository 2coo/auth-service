import { Fragment } from 'react';
import { Row } from 'antd'
import NewPasswordForm from '../../components/forms/new-password/NewPasswordForm';

const ResetPassword = ({ location }: any) => {
    return (
        <Fragment>
            <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
                <NewPasswordForm />
            </Row>
        </Fragment >
    )
}

export default ResetPassword
