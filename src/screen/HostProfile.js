import React from 'react'
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native' 
import { Container, Header, Left, Icon, View, List, ListItem, H1, Text, Body, Right, Thumbnail, Label, H3,Card, CardItem, H2, DeckSwiper } from 'native-base'
import Loader from '../components/Loader'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import StarRating from 'react-native-star-rating'
import colors from '../styles/colors'
export default class HostProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            result:[],
            loadingVisible:false,
            userName:'',
            userWork:'',
            accountCreate:'',
            userLocation:'',
            userLanguage:'',
            userDetail:'',
            photourl:'',
            supplierRating:0,
            renterRating:0,
            listing:[]
        }
    }

    async componentDidMount(){
        this.setState({
          loadingVisible: true
        })
        console.log("Response of filtered", this.props.route.params.userID)
        // const userID = await this.getUserID()
        if(this.props.route.params.userID){
          const getName = await this.getUSERDATA(this.props.route.params.userID)
          const response = await this.getItemList(this.props.route.params.userID)
          console.log("getName[0]",getName[0])
          const photo = getName[0].photo
          const userWork = getName[0].userWork
          const userDetail = getName[0].userDetail
          const userLocation = getName[0].userWork
          const userLanguage = getName[0].userLanguage
          const userName = getName[0].firstName
          const supplierRating = getName[0].supplierRating
          const renterRating = getName[0].renterRating
          const accountCreate = getName[0].accountCreate
          this.setState({
            loadingVisible: false,
            userPhoto: photo,
            userWork: userWork,
            userLocation: userLocation,
            userDetail: userDetail,
            userLanguage:userLanguage,
            userID:this.props.route.params.userID,
            supplierRating: supplierRating,
            renterRating: renterRating,
            userName: userName,
            accountCreate:accountCreate,
            photourl: photo,
          })
          if(response.length > 0){
            this.setState({
              listing: response
            })
          }
        } else {
          this.setState({
            loadingVisible: false,
            userPhoto: ''
          })
        }
      }

      getItemList = async(userID) =>{
        let result = []
        return new Promise((resolve, reject)=>{
          firestore().collection('ItemList')
          .where('userID', '==', userID)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
              // resolve(documentSnapshot.data())
              result.push(documentSnapshot.data())
            });
            resolve(result)
          });
        })
      }
  
      getUserID = async() =>{
        return new Promise((resolve, reject)=>{
          auth().onAuthStateChanged(user => {
            if (!user) {
            } else {
              resolve(user.uid)
            }
          })
        })
      }
  
      getUSERDATA = async(userID) =>{
        let result = []
        return new Promise((resolve, reject)=>{
          firestore()
            .collection('Users')
            .where('uid', '==', userID)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(documentSnapshot => {
                // resolve(documentSnapshot.data())
                result.push(documentSnapshot.data())
              });
              resolve(result)
            });
        })
      }

    render(){
      const { listing } = this.state
        console.log("lisitnd data", listing)
        return(
            <Container>
                <Loader
                    modalVisible={this.state.loadingVisible}
                    animationType="fade"
                />
                <Header transparent>
                    <Left>
                        <Icon onPress={() => this.props.navigation.goBack()} type="AntDesign"  name="arrowleft" />
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <ScrollView showsVerticalScrollIndicator={false}>
                <List>
                    <ListItem>
                        <Body>
                            <Text style={{fontSize:24}}>Hi, I'm {this.state.userName} </Text>
                            <Text style={{ marginTop:10, fontWeight:'100'}}>
                                Joined in {this.state.accountCreate}
                            </Text>
                            <View style={styles.ViewStyle}>
                              <Icon type="MaterialIcons" name="verified-user" fontSize={20} style={{fontSize:20, color:'green'}} />
                              <Text style={styles.TextStyle}>Identity not verified</Text>
                            </View>
                            <View style={styles.ViewStyle}>
                              <StarRating
                                maxStars={5}
                                starSize={20}
                                starStyle={colors.saagColor}
                                fullStarColor={colors.saagColor}
                                rating={this.state.supplierRating}
                              />
                              <Text style={styles.TextStyle}>{this.state.supplierRating} Rating as Supplier</Text>
                            </View>
                            <View style={styles.ViewStyle}>
                              <StarRating
                                maxStars={5}
                                starSize={20}
                                starStyle={colors.saagColor}
                                fullStarColor={colors.saagColor}
                                rating={this.state.renterRating}
                              />
                              <Text style={styles.TextStyle}>{this.state.renterRating} Rating as Renter</Text>
                            </View>
                        </Body>
                        <Right>
                            <Thumbnail
                                source={this.state.photourl && {uri:  this.state.photourl}}
                            />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <H1>About</H1>
                            <Text  style={{marginTop:20}}>
                                "{" "}
                                  <Text>{this.state.userDetail}</Text>
                                {" "}"
                            </Text>
                            <View style={styles.ViewStyle}>
                              <Icon type="Ionicons" name="home" fontSize={20} style={{fontSize:20}} />
                              <Text style={styles.TextStyle}>Live is {this.state.userLocation}</Text>
                            </View>
                            <View style={styles.ViewStyle}>
                              <Icon type="Ionicons" name="chatbubbles" fontSize={20} style={{fontSize:20}} />
                              <Text style={styles.TextStyle}>Speaks {this.state.userLanguage}</Text>
                            </View>
                            <View style={styles.ViewStyle}>
                              <Icon type="Ionicons" name="ios-briefcase" fontSize={20} style={{fontSize:20}} />
                              <Text style={styles.TextStyle}>Works at {this.state.userWork}</Text>
                            </View>
                        </Body>
                    </ListItem>
                    <ListItem>
                      <Body>
                        <H3>{this.state.userName} confirmed </H3>
                            <View style={styles.CheckView}>
                              <Icon type="EvilIcons" name="check" fontSize={20} style={{fontSize:20}} />
                              <Text style={styles.CheckText}>Identity</Text>
                            </View>
                            <View style={styles.CheckView}>
                              <Icon type="EvilIcons" name="check" fontSize={20} style={{fontSize:20}} />
                              <Text style={styles.CheckText}>Email Address</Text>
                            </View>
                            <View style={styles.CheckView}>
                              <Icon type="EvilIcons" name="check" fontSize={20} style={{fontSize:20}} />
                              <Text style={styles.CheckText}>Phone number</Text>
                            </View>
                      </Body>
                    </ListItem>
                    <ListItem 
                        style={{flex:1, }}>
                      <Body>
                      <H3>
                        {this.state.userName}'s listing
                      </H3>
                      <ScrollView horizontal
                        style={{flex:1, }}
                        showsHorizontalScrollIndicator={false}>
                      { listing.length > 0
                        ?
                        listing.map((item,index) =>(
                          <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('HostSelected', {
                              listed: item
                            })} 
                            key={item.id}
                          >
                            <Card transparent style={styles.CardStyle}>
                              <CardItem cardBody>
                                {/* <Thumbnail square source={item[0].photo && {uri: item[0].photo}} style={{ height:hp('30%'),width:wp('90%'), borderRadius:10}} /> */}
                                <ScrollView horizontal style={{width: wp('100%')}} showsHorizontalScrollIndicator={false}>
                                  {item.photo && item.photo.map((i,ind)=>(
                                    <Thumbnail square source={i && {uri: i}}  style={{ height:hp('30%'),width:wp('90%'), borderRadius:10}} /> 
                                  ))}
                                  {/* {item.photo && 
                                    <DeckSwiper
                                      dataSource={item.photo}
                                      renderItem={img =>
                                        <Card style={{ elevation: 3 }}>
                                          <CardItem cardBody>
                                            <Thumbnail style={{ height: 300, flex: 1 }} source={img && {uri:img}} />
                                          </CardItem>
                                        </Card>
                                      } />
                                  } */}
                                </ScrollView>
                              </CardItem>
                              <CardItem cardBody style={{marginLeft:10,marginTop:10, marginBottom:10, backgroundColor:'white'}}>
                                <View style={{marginTop:10, marginBottom:10}}>
                                  <Text note>
                                    Anytime
                                  </Text>
                                  <H2 style={styles.contentType}>
                                    {item.location}
                                  </H2>
                                  <Text style={styles.contentType}>1 stay</Text>
                                </View>
                              </CardItem>
                            </Card>
                          </TouchableOpacity>
                        ))
                        :
                        null
                        }
                      </ScrollView>
                      </Body>
                    </ListItem>
                </List>
                </ScrollView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
  ViewStyle:{
    marginTop:20,
    marginBottom:20, 
    flexDirection:'row'
  },
  TextStyle:{
    marginLeft:20, 
    fontWeight:'100'
  },
  CheckText:{
    marginLeft:20, 
    fontWeight:'100'
  },
  CheckView:{
    marginTop:10,
    flexDirection:'row'
  },
  contentType:{
    marginTop:10,
  },
  CardStyle:{
    borderRadius:10, 
    width:wp('90%'),
    // marginLeft:wp('5%'), 
    borderWidth:1, 
    borderColor:'white',
    marginTop:50
  }
})