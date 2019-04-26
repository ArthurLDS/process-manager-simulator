import React, { Component } from 'react';
import { Button, Card, Container, Form, ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class SimulatorInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            processCreated : [],
            processAble: [],
            processExecution: [],
            processBlocked: [],
            processDestroyed: [],
            numberProcess: 0,
            timeCicle: 0,
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : [event.target.value]})
    }


    onClickRun = () => {
        this.createProcess()
    }


    createProcess(){
        let process = [
            {name: "Google Chrome", time: 10},
            {name: "Counter Strike", time: 10},
            {name: "Android Studio", time: 10},
            {name: "Visual Studio Code", time: 10},
            {name: "Spotfy", time: 10},
            {name: "Discord", time: 10},
        ]
        this.setState({processCreated : process})
    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <Card.Header>Parâmetros</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="frmNumProccess">
                                        <Form.Label>Número de processos</Form.Label>
                                        <Form.Control type="number" onChange={this.handleChange} name="numberProcess" max="200" placeholder="Ex: 50" />
                                    </Form.Group>

                                    <Form.Group controlId="frmCicleTime">
                                        <Form.Label>Tempo após cada ciclo do processador</Form.Label>
                                        <Form.Control type="number" onChange={this.handleChange} name="timeCicle" placeholder="Ex: 1" />
                                    </Form.Group>

                                    <Button variant="success" type="button" onClick={this.onClickRun}>
                                        Executar processos
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="default_spacing">
                    <Col sm={6}>
                        <Card>
                            <Card.Header>Criação</Card.Header>
                            <ListGroup variant="flush">

                                {this.state.processCreated.map((process) =>
                                    <ListGroup.Item>{process.name}</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col sm={6}>
                        <Card>
                            <Card.Header>Apto</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row className="default_spacing">
                    <Col sm={4}>
                        <Card>
                            <Card.Header>Execução</Card.Header>
                            <Card.Body>

                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card>
                            <Card.Header>Bloqueado</Card.Header>
                            <Card.Body>

                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card>
                            <Card.Header>Destruição</Card.Header>
                            <Card.Body>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}