import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./LandingPage.css";
import TokenService from "../Services/token-service";

export default class LandingPage extends Component {
  state = {
    redirect: false,
    where: "",
  };
  switchPage = (link) => {
    if (link === "Home" && TokenService.hasAuthToken()) {
      link = "LandingPage";
    }
    this.setState({
      redirect: !this.state.redirect,
      where: link,
    });
    return;
  };
  render() {
    const { redirect, where } = this.state;

    if (redirect) {
      return <Redirect to={`/${where}`} />;
    }

    return (
      <div>
        <section className="banner">
          <div className="Cover">
            <h2>SNAP Locator</h2>
            <p>Connect with SNAP retailers and locations in your area</p>
            <button onClick={() => this.switchPage("find")}>Get started</button>
          </div>
        </section>
      </div>
    );
  }
}
