import React, { Component } from 'react';
import { Button, Card, Container, Form, ListGroup, Badge } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import If from './If';
import CardProcess from './CardProcess';
import DeviceCardList from './DeviceCardList';
import ProcessService from '../service/processService'

const processType = {
    CREATED: "CREATED",
    ABLE: "ABLE",
    RUNNING: "RUNNING",
    BLOCKED: "BLOCKED",
    DESTROYED: "DESTROYED",
};

const deviceType = {
    PRINTER: "Impressora",
    VIDEO: "Vídeo",
    HD: "HD",
};

export default class SimulatorManager extends Component {

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
            totalTimeExecution: 0,

            totalProcesses: 0,
            totalCicles: 0,
            dateInitial: Date(),
            dateFinal: Date(),
            dateInitProcessing: Date(),
            dateEndProcessing: Date(),
            qtdCreated: 0,
            qtdAble: 0,
            qtdExecution: 0,
            qtdBlocked: 0,
            qtdDestroyed: 0,
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
        await this.setState({
            isSimulationRunning: true, isSimulationDone: false,
            totalProcesses: processesSelecteds.length
        })

        await this.operateProcesses(processesSelecteds, processType.CREATED);
        await this.operateProcesses(processesSelecteds, processType.ABLE);

        await this.executeProcess(processesSelecteds)

        //await this.operateProcesses(processesSelecteds, processType.BLOCKED);
        await this.operateProcesses(processesSelecteds, processType.DESTROYED);
        await this.setState({ isSimulationRunning: false, isSimulationDone: true, totalTimeExecution: 0 })
    }

    async executeProcess(processesAbles) {
        let totalCiclesCPU = 0
        let processService = new ProcessService()
        await this.setState({dateInitProcessing: new Date()})
        while (processesAbles.some(p => p.cicles > 0 || p.blocked)) {
            await this.asyncForEach(processesAbles.reverse(), async (p) => {
                if (p.cicles > 0) {
                    if (processService.needToAcessDevice()) {
                        p.blocked = true
                        this.runInOutStage(p)
                        console.log("BLOQUEADO:", p.name)
                    } else {
                        await this.setState({ processesExecution: [p] })
                    }
                    let ables = processesAbles.filter(pa => pa.id != p.id && !pa.blocked)
                    await this.setState({ processesAble: ables })
                    await this.sleep(this.state.timeCicle);

                    for (let i = 0; i < 30; i++) {
                        totalCiclesCPU++;
                        p.cicles = p.cicles - 1
                        if (p.cicles <= 0) {
                            p.dateFinal = new Date()
                            processesAbles = ables
                            this.setState({ processesAble: ables })
                            break
                        }
                    }
                }
            })
        }
        await this.setState({ processesExecution: [], totalCicles: totalCiclesCPU, dateEndProcessing: new Date(), dateFinal: new Date() })
        return
    }

    async runInOutStage(process) {
        let processService = new ProcessService()
        let deviceName = processService.selectRandonDevice()
        process["type"] = deviceName
        let processesBlocked = this.state.processesBlocked;
        processesBlocked.push(process)
        await this.setState({ processesBlocked: processesBlocked })
        await this.sleep(this.state.timeCicle);
        process.blocked = false
        processesBlocked.filter(p => p.id != process.id)
    }

    async operateProcesses(processesSelecteds, type) {
        let processesDone = []
        await this.asyncForEach(processesSelecteds, async (p) => {
            await this.sleep(this.state.timeCicle);
            processesDone.push(p);
            p.dateInitial = new Date();
            switch (type) {
                case processType.CREATED:
                    let qtdCreated = this.state.qtdCreated
                    qtdCreated++
                    await this.setState({ processesCreated: processesDone, qtdCreated: qtdCreated })
                    break;
                case processType.ABLE:
                    let qtdAble = this.state.qtdAble
                    qtdAble++
                    this.state.processesCreated.shift()
                    await this.setState({ processesAble: processesDone, qtdAble: qtdAble })
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
                    let blockeds = this.state.processesBlocked.shift()
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

    getListPrinter() {
        return this.state.processesBlocked.filter(p => p.type === deviceType.PRINTER)
    }
    getListVideo() {
        return this.state.processesBlocked.filter(p => p.type === deviceType.VIDEO)
    }
    getListHD() {
        return this.state.processesBlocked.filter(p => p.type === deviceType.HD)
    }

    getTotalTime(dateInitial, dateFinal) {
        let startDate = new Date(dateInitial)
        let endDate = new Date(dateFinal)
        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        return this.convertSeconds(seconds)
    }

    getTotalProcessHD() {
        return this.state.processesDestroyed.filter(p => p.type === deviceType.HD).length
    }
    getTotalProcessVideo() {
        return this.state.processesDestroyed.filter(p => p.type === deviceType.VIDEO).length
    }
    getTotalProcessPrinter() {
        return this.state.processesDestroyed.filter(p => p.type === deviceType.PRINTER).length
    }

    convertSeconds(sec) {
        let hours = Math.floor(sec / 3600);
        sec %= 3600;
        let minutes = Math.floor(sec / 60);
        let seconds = Math.round(sec % 60);
        minutes = String(minutes).padStart(2, "0");
        hours = String(hours).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`
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
                                    <h6>Running simulation...</h6>
                                </If>
                                <If test={this.state.isSimulationDone}>
                                    <Row style={{ marginBottom: '15px' }}>
                                        <Col>
                                            <div><strong>Numero total de processos:</strong><span>&nbsp;
                                                {this.state.totalProcesses}</span>
                                            </div>
                                            <div><strong>Tempo total de execução:</strong><span>&nbsp;
                                                {this.getTotalTime(this.state.dateInitial, this.state.dateFinal)}</span>
                                            </div>
                                            <div><strong>Número total de ciclos:</strong><span>&nbsp;
                                                {this.state.totalCicles}</span>
                                            </div>
                                            <div><strong>Tempo médio de espera fila de aptos:</strong>
                                                <span>&nbsp;
                                                    {this.getTotalTime(this.state.dateInitProcessing, this.state.dateEndProcessing)}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div><strong>Qtd. processos em criação:</strong><span>&nbsp;{this.state.totalProcesses}</span></div>
                                            <div><strong>Qtd. processos em aptos.:</strong><span>&nbsp;{this.state.totalProcesses}</span></div>
                                            <div><strong>Qtd. processos em execução:</strong><span>&nbsp;{this.state.totalProcesses}</span></div>
                                            <div className="margin-top">
                                                <strong>Qtd. processos em bloqueados:</strong>
                                            </div>
                                            <div>
                                                <span className="margin-right">
                                                    <strong>HD:</strong>
                                                    <span>&nbsp;{this.getTotalProcessHD()}</span>
                                                </span>
                                                <span className="margin-right">
                                                    <strong>Vídeo:</strong>
                                                    <span>&nbsp;{this.getTotalProcessVideo()}</span>
                                                </span>
                                                <span className="margin-right">
                                                    <strong>Impressora:</strong>
                                                    <span>&nbsp;{this.getTotalProcessPrinter()}</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
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
                        <Col sm={4}>
                            <CardProcess title="Criação" list={this.state.processesCreated} />
                        </Col>
                        <Col sm={4}>
                            <CardProcess title="Apto" list={this.state.processesAble} />
                        </Col>
                        <Col sm={4}>
                            <CardProcess title="Execução" list={this.state.processesExecution} />
                        </Col>
                    </Row>
                    <Row className="default_spacing">
                        <Col sm={8}>
                            <Card>
                                <Card.Header>Bloqueado</Card.Header>
                                <Row className="list-row">
                                    <DeviceCardList title="Vídeo" list={this.getListVideo()} />
                                    <DeviceCardList title="Impressora" list={this.getListPrinter()} />
                                    <DeviceCardList title="HD" list={this.getListHD()} />
                                </Row>
                            </Card>
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