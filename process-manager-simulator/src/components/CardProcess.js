import React, { Component } from 'react';
import { Button, Card, Container, Form, ListGroup, Badge } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import If from '../components/If';
import ProcessService from '../service/processService'

export default class CardProcess extends Component {

    isSuccess(cicles){
        return cicles >= 30 ? "primary" : "danger" 
    }

    render() {
        return (
            <Card>
                <Card.Header>{this.props.title}</Card.Header>
                <ListGroup variant="flush" className="panel-body">
                    <If test={this.props.list.length <= 0}>
                        <Card.Body>
                            Nenhum processo encontado no momento
                        </Card.Body>
                    </If>
                    {this.props.list.map((process) =>
                        <ListGroup.Item>
                            <span className="float-left">{process.name}</span>
                            <Badge variant={this.isSuccess(process.cicles)} className="float-right">
                                {process.cicles}
                            </Badge>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        )
    }
}