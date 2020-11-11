import React, { useEffect, useState } from 'react'
import { View, Text, Container, Header, Left, Button, Content, H2, List, ListItem, Right, CheckBox, H3, Switch, Body, Input, Picker } from 'native-base'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import colors from '../../styles/colors';
import StarRating from 'react-native-star-rating';
import InputField from '../form/InputField';
import ViewCalender from './CalenderModal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { getCategories } from '../../services/service'
function FilterModal ({ navigation }){

    const [multiSliderValue, setMultiSliderValue] = useState([1,200]);
    const [categories, setCategories] = useState([])
    const [selectedType, setType] = useState(false);
    const [location , setLocation] = useState('');
    const [man, setMan] = useState(false);
    const [woman, SetWoman] = useState(false);
    const [children, setChildren] = useState(false);
    const [English, setEnglish] = useState(false);
    const [French, setFrench] = useState(false);
    const [German, setGerman] = useState(false);
    const [calenderVisble, openCalender] = useState(false);
    const [category, setcategory] = useState('');
    const [starCount, setStar] = useState(0)
    
    const allClear = () =>{
        setMultiSliderValue([1,1000])
        setType(false)
        setLocation('')
        setStar(0)
        setcategory('')
    }

    useEffect(()=> {
        const getCategory = getCategories()
        getCategory.then(response =>{
            setCategories(response)
        })
    }, [])

    const checkAvail = () =>{
        console.log("CATEGORIEs", category)
        const result = {
            "multiSliderValue": multiSliderValue,
            "category": category,
            'Location': location,
            
            }
        navigation.navigate("ViewCategory",{
            result: result
        })
    }

    const multiSliderValuesChange = (value) =>{
        setMultiSliderValue(value)
    }

    const setLangugae = value =>{
        if(value === "German"){
            setGerman(!German)
        }
        if(value === "French"){
            setFrench(!French)
        }
        if(value === "English"){
            setEnglish(!English)
        }
    }

    const categor = (value) =>{
        if(value === "Trending"){
            setType("Trending")
            }
        if(value === "Wanted"){
            setType("Wanted")
        }
    }

    const Advent = (value) =>{
        if(value === "Man"){
            setMan(!man)
        }
        if(value === "Woman"){
            SetWoman(!woman)
        }
        if(value === "Children"){
            setChildren(!children)
        }
    }

    const onStarRatingPress = (rating) => {
        setStar(rating)
    }

    const changeCategory = (value) => {
        setcategory(value)
    }

    return(
        <Container style={{backgroundColor:colors.saagColor}}>
            {/* <ViewCalender
                isVisible={calenderVisble} onPress={() =>calenderModal()} /> */}
                <Header transparent>
                    <Left>
                        <Button transparent onPress={() => navigation.goBack()}> 
                            <Text style={{color:'white'}}> X </Text>
                        </Button>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content padder>
                        <ListItem noBorder>
                                <Body style={{marginLeft:'-5%'}}>
                                    <Text style={{fontSize:30, color:"white"}} > 
                                    Popular filters 
                                    </Text>
                                    <Text style={{color:"white", marginTop:10}} note> 
                                        These are some of the filters people often use 
                                    </Text>
                                </Body>
                        </ListItem>
                    <List>
                        <ListItem>
                            <View>
                                <H2 style={{color:"white"}}>Price range</H2>
                                <Text style={{color:"white"}}>${multiSliderValue[0]} - ${multiSliderValue[1]}</Text>
                                <Text style={{color:"white"}} note>The average daily price is $40</Text>
                                <MultiSlider
                                    values={[multiSliderValue[0], multiSliderValue[1]]}
                                    sliderLength={250}
                                    onValuesChange={multiSliderValuesChange}
                                    min={0}
                                    max={1000}
                                    step={1}
                                    allowOverlap
                                    snapped
                                    // customLabel={CustomLabel}
                                />
                            </View>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <H2 style={{color:"white"}}>Renter Rating</H2>
                            </Left>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <StarRating
                                    disabled={false}
                                    fullStarColor={colors.white}
                                    starStyle={colors.white}
                                    maxStars={5}
                                    rating={starCount}
                                    selectedStar={(rating) => onStarRatingPress(rating)}
                                />
                            </Body>
                        </ListItem>
                        <View>
                            <InputField
                                labelText="Location"
                                labelTextSize={20}
                                labelColor={colors.white}
                                textColor={colors.white}
                                borderBottomColor={colors.white}
                                inputType="email"
                                placeholderTextColor={colors.white}
                                placeholder="New York, USA"
                                customStyle={{ marginBottom: 30,marginTop:20,marginLeft:10 }}
                                onChangeText={(text) => setLocation(text)}
                                value={location}
                                autoFocus
                            />
                        </View>
                        <View style={{marginLeft:'2%'}}>
                            <Text style={{color:'white', marginBottom:5}} >Categories:</Text>
                            <Picker
                                mode="dropdown"
                                placeholderStyle={{ color: "white"}}
                                placeholder="Type"
                                textStyle={{ color: "white" }}
                                itemTextStyle={{ color: 'black' }}
                                placeholderIconColor="#007aff"
                                style={{ width: wp('100%'), textAlign:'left', marginLeft:'-5%', marginBottom:30, borderBottomColor:'white', borderBottomWidth:1 }}
                                selectedValue={category}
                                // onValueChange={this.addCategory.bind(this)}
                                onValueChange={changeCategory}
                            >
                            {
                            categories.map((item, index)=>(
                                <Picker.Item key={index} label={item.categoryName} value={item.categoryName} />
                            ))
                            }
                            </Picker>
                        </View>
                    </List>
                </Content>
                <View style={{flexDirection:'row', marginBottom:5}}>
                        <View style={{marginTop:10}}>
                            <Button onPress={() => allClear()}  transparent>
                                <Text style={{color:colors.white}}>Clear all</Text>
                            </Button>
                        </View>
                        <Button onPress={() => checkAvail()} transparent style={{position:"absolute",marginTop:5, bottom:0, right:20,borderWidth:1, borderColor:colors.white}}>
                            <Text style={{ color:'white' }}>Check Availability</Text>
                        </Button>
                </View>
            </Container>
    )
}

export default FilterModal