import React from 'react';
import PropTypes from 'prop-types';
import cn from '@sindresorhus/class-names';
import Head from 'next/head';
import { Formik } from 'formik';
import axios from 'axios';
import ReactGA from 'react-ga';

import { MoonLoader } from 'react-spinners';

import '../styles/import/home.scss';

import logoNinja from '../assets/logo-ninja-constant.svg.raw';
import humburgerIcon from '../assets/hamburger.svg.raw';

// import '../scripts/landing-effect';

class ConstantLandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasSubscribed: false,
      showMenu: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);

    this.handleScroll();

    ReactGA.initialize('UA-128480092-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }

  detectScrolledToBottom = () => {
    const d = document.documentElement;
    const offset = d.scrollTop + window.innerHeight;
    const height = d.offsetHeight;

    if (offset >= height - 50) {
      console.log('At the bottom');
    }

    if (offset === height) {
      ReactGA.event({
        category: 'scroll',
        action: 'scrolled to bottom'
      });
    }
  }

  handleScroll = () => {
    const block5div = document.getElementById('landing-page-constant-block-5');
    const header = document.getElementById('landing-page-constant-header');
    const { offsetTop } = block5div;
    if (document.documentElement.scrollTop > offsetTop - 50 || document.body.scrollTop > offsetTop - 50) {
      if (!header.classList.contains('block5')) {
        header.classList.add('block5');
      }
    } else {
      header.classList.remove('block5');
    }
    this.detectScrolledToBottom();
  }

  isMobile = () => {
    const ele = document.getElementById('is-mobile');
    return ele && window.getComputedStyle(ele).getPropertyValue('display') === 'block';
  }

  handleSubmit = (values, setSubmitting) => {
    const name = 'constant';
    const { email: emailSub } = values;
    const formData = new FormData();
    formData.set('email', emailSub);
    formData.set('product', name);

    ReactGA.event({
      category: 'social',
      action: 'submit subscribe',
      value: emailSub,
    });

    axios({
      method: 'POST',
      url: `https://ninja.org/api/user/subscribe`,
      data: formData,
    })
      .then(() => {
        this.setState({ hasSubscribed: true }, () => { setSubmitting(false); });
        ReactGA.event({
          category: 'social',
          action: 'submit subscribe success',
          value: emailSub,
        });
      })
      .catch(err => {
        console.log('err subscribe email', err);
        setSubmitting(false);
        ReactGA.event({
          category: 'social',
          action: 'submit subscribe failed',
          value: emailSub,
        });
      });
  };

  toggleShowMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  render() {
    const { hasSubscribed, showMenu } = this.state;

    return (
      <main className="landing-page-constant">
        <div id="is-mobile" />
        <Head>
          <title>Constant: Untraceable, constant, digital cash.</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="Constant is a different kind of cryptocurrency. It is cryptographically-secured, privacy-protected digital paper money with constant purchasing power. Cryptocurrency you can actually use. Be the first to get Constant when it launches." />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
          <link rel="manifest" href="/static/icons/site.webmanifest" />
          <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#0a2240" />
          <meta name="msapplication-TileColor" content="#0a2240" />
          <meta name="theme-color" content="#0a2240" />
          <meta property="og:url" content="https://constant.money" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Constant: Untraceable, constant, digital cash." />
          <meta property="og:description" content="Constant is a different kind of cryptocurrency. It is cryptographically-secured, privacy-protected digital paper money with constant purchasing power. Cryptocurrency you can actually use. Be the first to get Constant when it launches." />
          <meta property="og:image" content="https://constant.money/static/images/preview.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@ninjadotorg" />
          <meta name="twitter:creator" content="@ninjadotorg" />
          <link rel="stylesheet" href="https://use.typekit.net/bro5hwc.css" />
        </Head>
        <header className="landing-page-constant-header" id="landing-page-constant-header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="landing-page-constant-logo">
                  <a href="/"><div dangerouslySetInnerHTML={{ __html: logoNinja }} /></a>
                </div>
                <div onClick={this.toggleShowMenu} className="landing-page-constant-hamburger" dangerouslySetInnerHTML={{ __html: humburgerIcon }} />
                <div className={
                  cn(
                    'landing-page-constant-menu',
                    { show: showMenu },
                  )
                }
                >
                  <ul>
                    <li>
                      <ReactGA.OutboundLink
                        eventLabel="constant.clicked.header.ninja-product"
                        to="https://ninja.org/product"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Product
                    </ReactGA.OutboundLink>
                    </li>
                    <li>
                      <ReactGA.OutboundLink
                        eventLabel="constant.clicked.header.ninja-research"
                        to="https://ninja.org/research"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Research
                      </ReactGA.OutboundLink>
                    </li>
                    <li>
                      <ReactGA.OutboundLink
                        eventLabel="constant.clicked.header.ninja-recruiting"
                        to="https://ninja.org/recruiting?project=Constant"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-constant"
                      >
                        Join the Constant team
                      </ReactGA.OutboundLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className="landing-page-constant-block cd-section block-1">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7 col-lg-6 col-xl-5 project-detail">
                <div className="landing-page-constant-heading">
                  Constant
                  <div className="slogan">Untraceable, stable, digital cash.</div>
                </div>
                <p style={{ marginTop: '38px', fontWeight: 'bold' }}>Receive curated development and community updates.</p>
                {
                  !hasSubscribed
                    ?
                    (
                      <Formik
                        initialValues={{ email: '' }}
                        validate={values => {
                          let errors = {};
                          if (!values.email) {
                            errors.email = 'Required';
                          } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                          ) {
                            errors.email = 'Invalid email address';
                          }
                          return errors;
                        }}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={(values, { setSubmitting }) => {
                          setTimeout(() => {
                            this.handleSubmit(values, setSubmitting);
                          }, 400);
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                          /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                              <div className="landing-page-constant-subscribe">
                                <input
                                  placeholder="Enter your email address"
                                  className="form-control landing-page-constant-subscribe-input has-error"
                                  type="text"
                                  name="email"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.email}
                                />
                                {errors.email && touched.email && <span className="w-100 text-danger text-left"><span>{errors.email}</span></span>}
                                <button type="submit" className="btn-constant" disabled={isSubmitting}>
                                  {
                                    !isSubmitting
                                      ? "Submit"
                                      : (
                                        <MoonLoader
                                          sizeUnit={"px"}
                                          size={18}
                                          color={'#fff'}
                                          loading={true}
                                        />
                                      )
                                  }
                                </button>
                              </div>
                            </form>
                          )}
                      </Formik>
                    )
                    :
                    (
                      <h5>
                        <strong className="text-success">
                          Thank you for subscribing!
                        </strong>
                      </h5>
                    )
                }
                <div>
                  <span className="mouse">
                    <span className="mouse__wheel"></span>
                  </span>
                </div>
              </div>
              <div className="col-12 col-md-5 col-lg-6 col-xl-7 img-container">
                <img src="/static/images/block1.png" alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block cd-section block-2">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7 col-lg-6 col-xl-5">
                <div className="landing-page-constant-heading">Borderless. Stable</div>
                <p>Constant is a different kind of cryptocurrency. Like Bitcoin, it is completely decentralized; nobody owns or controls Constant. Unlike Bitcoin however, Constant is stable, so you can spend it on everyday things. </p>
                <p>People continue to choose paper money for the benefits of privacy, control and autonomy, but it nervously sits under mattresses, and can only travel through multiple hands. Constant is cryptographically-secured, privacy-protected digital paper money - that you can instantly send across borders, not just streets.</p>
                <p>Constant gives you anonymity and control, and complete freedom with your money.</p>
              </div>
              <div className="col-12 col-md-5 col-lg-6 col-xl-7 img-container">
                <img src="/static/images/block2.png" alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block cd-section block-3">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7 col-lg-6 col-xl-5">
                <div className="landing-page-constant-heading">Autonomous monetary policy</div>
                <p>Cryptocurrencies today are unuseable. You wouldn’t use Bitcoin, or any coin, to buy a cup of coffee, or shop online. Businesses don’t pay salaries or invoices in cryptocurrency because they wouldn’t be accepted. And as for financial services -  offering a loan or taking a deposit in coin is a gamble that few dare take.</p>
                <p>The stability of Constant enables these use cases at scale.</p>
                <p>Our AI scientists and economics researchers are working together to develop an adaptive, self-learning, self-adjusting, autonomous monetary policy that can weather all market conditions, keeping the value of Constant stable at all times.</p>
              </div>
              <div className="col-12 col-md-5 col-lg-6 col-xl-7 img-container">
                <img src="/static/images/block3.png" alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block cd-section block-4">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7 col-lg-6 col-xl-5">
                <div className="landing-page-constant-heading">Total privacy</div>
                <p>Your entire payment history is public on the blockchain. Transparency is one of the blockchain’s strongest ideals, but in practice, visibility is a vulnerability. Currently, anyone with an internet connection can find out how much money you have, and what you spend it on. </p>
                <p>Constant provides a mechanism for legitimate exchange that also safeguards your privacy. </p>
                <p>At the core of Constant is zero-knowledge cryptography. Your transaction information, including sender, receiver, and transaction value, is never exposed. Constant is untraceable.
                </p>
              </div>
              <div className="col-12 col-md-5 col-lg-6 col-xl-7 img-container">
                <img src="/static/images/block4.png" alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block cd-section block-5" id="landing-page-constant-block-5">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-7 col-lg-6 col-xl-5">
                <div className="landing-page-constant-heading">Constant is digital money you can actually use.</div>
                <p>
                  <ReactGA.OutboundLink
                    eventLabel="constant.clicked.footer.telegram"
                    to="https://t.me/ninja_org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-constant"
                  >
                    <img src="/static/images/telegram.svg" alt="" />Connect with us on Telegram
                  </ReactGA.OutboundLink>
                </p>
              </div>
              <div className="col-12 col-md-5 col-lg-6 col-xl-7 img-container">
                <img src="/static/images/block5.png" alt="" />
              </div>
            </div>
          </div>
        </section>
        <ul className="cd-vertical-nav">
          <li><a href="#0" className="cd-prev">Next</a></li>
          <li><a href="#0" className="cd-next">Prev</a></li>
        </ul>
      </main>
    );
  }
}

export default ConstantLandingPage;
