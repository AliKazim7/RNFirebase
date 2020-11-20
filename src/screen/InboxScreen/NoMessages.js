import React from 'react'
import { Text, View } from 'react-native'
import colors from '../../styles/colors'

export default class NoMessages extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return(
            <View style={{ backgroundColor: colors.white, flex:1}}>
                <Text style={{fontWeight:'bold', marginBottom:10,fontSize:16, marginTop:20,marginLeft:20,}}>
                    You have no unread messages
                </Text>
                <Text style={{marginLeft:20,fontSize:14,}}>
                    When you contact a host or send a reservation
                    request, you'll see your messages here.
                </Text>
            </View>
        )
    }
}