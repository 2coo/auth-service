import { Carousel, Col, Layout, Row } from "antd";
import clsx from "clsx";
import React, { Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import loginStyles from "../../assets/jss/view/loginStyles";
import RegisterForm from "../../components/forms/register/RegisterForm";

const { Content } = Layout;

const SignUpPage = ({ location }: any) => {
  const classes = loginStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Register</title>
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
            <RegisterForm />
          </Col>
        </Row>
      </Content >
    </Fragment >
  )
}

export default SignUpPage
