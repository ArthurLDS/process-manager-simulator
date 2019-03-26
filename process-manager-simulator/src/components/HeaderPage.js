import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import logo from '../logo.svg';

export default class HeaderPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <header className="App-header">
                    <h1>
                        Process Manager Simulator
                    </h1>
                </header>
            </div>
        )
    }
}