import { Platform, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen'
//HeadStyle is dynamic for all headers. Add object name here and call in any place using headStyle.
const headStyle = StyleSheet.create({
    leftHeader:{
        position:"absolute", 
        left:10,
        top: Platform.OS === "android" ? hp('2%') : hp('5%'), 
        height:50,
        width:50, 
        backgroundColor:'white', 
        borderRadius:40
    },
    leftButton:{
        color:'black', 
        marginTop:12.5, 
        marginLeft:12.5
    },
    leftIcon:{
        color:'black', 
        marginTop:12.5, 
        marginLeft:12.5, 
        fontSize:25
    },
    rightHeader1:{
        position:"absolute",
        right:10,
        top: Platform.OS === "android" ? hp('2%') : hp('5%'),  
        height:50,
        width:50, 
        backgroundColor:'white', 
        borderRadius:40
    },
    rightHeader2:{
        position:"absolute",
        right:80, 
        top: Platform.OS === "android" ? hp('2%') : hp('5%'),  
        height:50,
        width:50, 
        backgroundColor:'white', 
        borderRadius:40
    },
    rightHeader3:{
        position:"absolute",
        right:10, 
        top:30, 
        height:50,
        width:50, 
        backgroundColor:'white', 
        borderRadius:40
    },
    rightButton:{
        color:'black', 
        marginTop:12.5, 
        marginRight:12.5
    },
    rightIcon:{
        color:'black', 
        marginTop:12.5, 
        marginLeft:12.5, 
        fontSize:25
    },
    rightSelected:{
        color:'red', 
        marginTop:12.5, 
        marginLeft:12.5, 
        fontSize:25
    },
    bottomCorousal:{
        position:"absolute",
        // right:10, 
        bottom:0, 
        color:'white',
        textAlignVertical:'center',
        marginLeft:widthPercentageToDP('50%')
        // height:50,
        // width:50, 
    }
})

export default headStyle