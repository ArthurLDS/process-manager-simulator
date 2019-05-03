import React, { Component } from 'react';
import { Button, Card, Container, Form, ListGroup, Badge } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import If from './If';
import ProcessService from '../service/processService'

export default class DeviceCardList extends Component {

    isSuccess(cicles) {
        return cicles >= 30 ? "primary" : "danger"
    }

    render() {
        return (
            <ListGroup variant="flush" className="panel-body col-md-4 border-right list-card">
                <div className="title-es">
                    <b>{this.props.title}</b>
                </div>
                <If test={this.props.list.length <= 0}>
                    <Card.Body>
                        Nenhum processo encontado no momento
                                            </Card.Body>
                </If>
                {this.props.list.map((process) =>
                    <ListGroup.Item>
                        <span className="float-left">{process.name}</span>
                    </ListGroup.Item>
                )}
            </ListGroup>
        )
    }
}