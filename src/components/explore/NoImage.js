import React from 'react'
import { 
    View,
    Image
} from 'react-native'
import { widthPercentageToDP as wp , heightPercentageToDP as hp } from 'react-native-responsive-screen'
export default class NoImage extends React.Component{
    render(){
        return(
                <Image style={{flex:1, height:hp('40%'), width:wp('100%'), backgroundColor:'#dcdfe4'}} resizeMode="contain" source={require('../../img/noImage.jpeg')} />
            )
    }
}