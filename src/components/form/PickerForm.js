import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Picker, Icon } from 'native-base';
export default class PickerForm extends Component {
    constructor(props) {
    super(props);
    this.state = {
      selected2: undefined
    };
  }
  onValueChange2(value) {
    this.setState({
      selected2: value
    });
  }
  render() {
    return (
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{ width: undefined }}
                placeholder="Gender"
                placeholderStyle={{ color: "white" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="Male" value="key0" />
                <Picker.Item label="Female" value="key1" />
                <Picker.Item label="Other" value="key2" />
              </Picker>
            </Item>
          </Form>
    );
  }
}