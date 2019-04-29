import React, { Component } from 'react';
import { throws } from 'assert';

class If extends Component{
    
    render(){
        return this.props.test ? this.props.children : null
    }

}

export default If