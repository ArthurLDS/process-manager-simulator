import React, { Component } from 'react';
import { Button, Card, Container, Form, ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import If from '../components/If';
import CardProcess from '../components/CardProcess';
import ProcessService from '../service/processService'

const processType = {
    CREATED: "CREATED",
    ABLE: "ABLE",
    RUNNING: "RUNNING",
    BLOCKED: "BLOCKED",
    DESTROYED: "DESTROYED",
};

export default class SimulatorInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            processesCreated: [],
            processesAble: [],
            processesExecution: [],
            processesBlocked: [],
            processesDestroyed: [],
            numberProcess: 0,
            timeCicle: 0,
            currentCicle: 0,
            isSimulationRunning: false,
            isSimulationDone: false,
            totalTimeExecution: 0
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: [event.target.value] })
    }

    onClickRun = () => {
        this.runProcesses()
    }

    async runProcesses() {
        let processService = new ProcessService()
        let processesSelecteds = (processService.selectRandon(this.state.numberProcess))
        console.log(processesSelecteds)
        await this.setState({ isSimulationRunning: true, isSimulationDone: false }, this.startTimer())
        await this.operateProcesses(processesSelecteds, processType.CREATED);

        //await this.operateProcesses(processesSelecteds, processType.ABLE);
        //await this.operateProcesses(processesSelecteds, processType.RUNNING);

        await this.executeProcess(processesSelecteds)

        await this.operateProcesses(processesSelecteds, processType.BLOCKED);
        await this.operateProcesses(processesSelecteds, processType.DESTROYED);
        await this.setState({ isSimulationRunning: false, isSimulationDone: true, totalTimeExecution: 0 })
    }


    async executeProcess(processesAbles) {
        console.log("ABLES", processesAbles[0].cicles)
        await this.setState({ processesAble: processesAbles })
        while (processesAbles.some(p => p.cicles > 0)) {
            await this.asyncForEach(processesAbles, async (p) => {
                if (p.cicles > 0) {
                    await this.setState({ processesExecution: [p] }) //TODO: Remove the process from processesAble too
                    for (let i = 0; i < 30; i++) {
                        await this.sleep(this.state.timeCicle);
                        console.log("DECREMENTOU OS CICLOS")
                        if (p.cicles <= 0) {
                            console.log("Zerou", p)
                            break
                        }
                        p.cicles = p.cicles - 1
                    }
                }
            })
        }
        console.log("AFTER ABLES", processesAbles)
    }

    async operateProcesses(processesSelecteds, type) {
        let processesDone = []
        await this.asyncForEach(processesSelecteds, async (p) => {
            await this.sleep(this.state.timeCicle);
            processesDone.push(p);
            switch (type) {
                case processType.CREATED:
                    await this.setState({ processesCreated: processesDone })
                    break;
                case processType.ABLE:
                    this.state.processesCreated.shift()
                    await this.setState({ processesAble: processesDone })
                    break;
                case processType.RUNNING:
                    this.state.processesAble.shift()
                    await this.setState({ processesExecution: processesDone })
                    break;
                case processType.BLOCKED:
                    this.state.processesExecution.shift()
                    await this.setState({ processesBlocked: processesDone })
                    break;
                case processType.DESTROYED:
                    this.state.processesBlocked.shift()
                    await this.setState({ processesDestroyed: processesDone })
                    break;
                default:
                    await this.setState({ processesCreated: processesDone })
            }

        })
        return;
    }

    sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    onClickRunAgain = () => {
        this.cleanUpProcesses();
        this.setState({ isSimulationRunning: false, isSimulationDone: false })
    }

    cleanUpProcesses() {
        this.setState({ processesCreated: [], processesAble: [], processesExecution: [], processesBlocked: [], processesDestroyed: [] })
    }


    startTimer() {
        let secondsCounter = 0
        setInterval(() => {
            if (this.state.isSimulationRunning)
                clearTimeout()
            this.setState({
                totalTimeExecution: secondsCounter
            })
            secondsCounter++
        }, 1000)
    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <Card.Header>Parâmetros</Card.Header>
                            <Card.Body>
                                <If test={!this.state.isSimulationRunning && !this.state.isSimulationDone}>
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
                                </If>
                                <If test={this.state.isSimulationRunning && !this.state.isSimulationDone}>
                                    <Button variant="warning" type="button" className="btn-operator" onClick={this.onClickRun}>
                                        Pausar simulação
                                    </Button>
                                    <Button variant="danger" type="button" className="btn-operator" onClick={this.onClickRun}>
                                        Parar simulação
                                    </Button>
                                    <h2>{this.state.totalTimeExecution}</h2>
                                </If>
                                <If test={this.state.isSimulationDone}>
                                    <Button variant="primary" type="button" className="btn-operator" onClick={this.onClickRunAgain}>
                                        Executar novamente
                                    </Button>
                                </If>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <If test={this.state.isSimulationRunning || this.state.isSimulationDone}>
                    <Row className="default_spacing">
                        <Col sm={6}>
                            <CardProcess title="Criação" list={this.state.processesCreated} />
                        </Col>
                        <Col sm={6}>
                            <CardProcess title="Apto" list={this.state.processesAble} />
                        </Col>
                    </Row>
                    <Row className="default_spacing">
                        <Col sm={4}>
                            <CardProcess title="Execução" list={this.state.processesExecution} />
                        </Col>
                        <Col sm={4}>
                            <CardProcess title="Bloqueado" list={this.state.processesBlocked} />
                        </Col>
                        <Col sm={4}>
                            <CardProcess title="Destruição" list={this.state.processesDestroyed} />
                        </Col>
                    </Row>
                </If>
            </div>
        )
    }
}