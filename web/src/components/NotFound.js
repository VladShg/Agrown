import React, { Component } from "react";

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.dict.d['page_not_found']}</h1>
      </div>
    )
  }
}
