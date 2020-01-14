import React, {Component} from 'react'
import FieldMap from './FieldMap'

export default class CollapsableMap extends Component {
    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)
        this.state = {
            show: false
        }
    }

    onClick(event) {
        this.setState({show: !this.state.show})
    }

    render() {
        const t = this.props.dict
        return (
            <div className='card'>
                <div className="card-header" id='header'>
                  <h5 className="mb-0">
                    <button onClick={this.onClick} className="btn btn-link collapsed" data-toggle="collapse" data-target={`#area${this.props.id}map`} aria-expanded="false">
                      {t.d['map']}
                    </button>
                    <div id={`area${this.props.id}map`} className="collapse" aria-labelledby="header">
                        {this.state.show === true && (
                            <FieldMap
                                name={this.props.name}
                                {...this.props}
                                readonly={true}
                                points={this.props.points}
                                dict={this.props.dict}
                            />
                        )}
                    </div>
                  </h5>
                </div>
            </div>
        )
    }
}