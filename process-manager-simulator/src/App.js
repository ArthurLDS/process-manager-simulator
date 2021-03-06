import React, { Component } from 'react';
import HeaderPage from './components/HeaderPage';
import SimulatorManager from './components/SimulatorManager';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <div className="container">
                <HeaderPage />
                <SimulatorManager/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
