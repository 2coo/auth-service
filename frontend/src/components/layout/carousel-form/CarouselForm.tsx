import { Fragment } from "react"
import { Carousel, Col, Layout, Row } from "antd";
import clsx from "clsx";
import carouselFormStyles from "../../../assets/jss/layout/carouselFormStyles";
const { Content } = Layout;

const CarouselForm = ({ children }: any) => {
    const classes = carouselFormStyles();
    return (
        <Fragment>
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
                        {children}
                    </Col>
                </Row>
            </Content>
        </Fragment>
    )
}

export default CarouselForm
