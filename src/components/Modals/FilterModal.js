import React, { useEffect, useState } from 'react'
import { View, Text, Container, Header, Left, Button, Content, H2, List, ListItem, Right, CheckBox, H3, Switch, Body, Input } from 'native-base'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import colors from '../../styles/colors';
import StarRating from 'react-native-star-rating';
import InputField from '../form/InputField';
import ViewCalender from './CalenderModal';

function FilterModal ({ navigation }){

    const [multiSliderValue, setMultiSliderValue] = useState([1,200]);
    const [selectedType, setType] = useState(false);
    const [location , setLocation] = useState('');
    const [man, setMan] = useState(false);
    const [woman, SetWoman] = useState(false);
    const [children, setChildren] = useState(false);
    const [English, setEnglish] = useState(false);
    const [French, setFrench] = useState(false);
    const [German, setGerman] = useState(false);
    const [calenderVisble, openCalender] = useState(false);
    const [dataSelected, setDateSelected] = useState(null);
    const [starCount, setStar] = useState(0)
    
    const allClear = () =>{
        setMultiSliderValue([1,1000])
        selectedType(false)
        setLocation('')
        setStar(0)
    }

    const checkAvail = () =>{
        const result = {
            "multiSliderValue": multiSliderValue,
            // "starCount": starCount,
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

    const calenderModal = () => {
        openCalender(!calenderVisble)
    }

    return(
        <Container>
            {/* <ViewCalender
                isVisible={calenderVisble} onPress={() =>calenderModal()} /> */}
                <Header transparent>
                    <Left>
                        <Button transparent onPress={() => navigation.goBack()}> 
                            <Text style={{color:'black'}}> X </Text>
                        </Button>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                {/* <Text style={{fontSize: 32}}> Popular filters </Text>  */}
                <Content padder>
                        <ListItem noBorder>
                                <Left>
                                    <Text style={{fontSize:30}} > 
                                    Popular filters 
                                    </Text>
                                </Left>
                        </ListItem>
                        <ListItem noBorder>
                                <Left>
                                    <Text note> 
                                        These are some of the filters people often use 
                                    </Text>
                                </Left>
                        </ListItem>
                        {/* <ListItem>
                            <Left>
                                <View>
                                    <Text>Trending</Text>
                                </View>
                            </Left>
                            <Right>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={selectedType === 'Trending' ? "#f5dd4b" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => categor('Trending')}
                                    value={selectedType === 'Trending' ? true : false}
                                />
                            </Right>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <View>
                                    <Text>Wanted</Text>
                                </View>
                            </Left>
                            <Right>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={selectedType === 'Wanted' ? "#f5dd4b" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => categor('Wanted')}
                                    value={selectedType === 'Wanted' ? true : false}
                                />
                            </Right>
                        </ListItem> */}
                    <List>
                        <ListItem noBorder>
                            <H3>
                            Adventurer
                            </H3>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <View>
                                    <Text>Man</Text>
                                </View>
                            </Left>
                            <Right>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={man ? "#f5dd4b" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => Advent('Man')}
                                    value={man}
                                />
                            </Right>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <View>
                                    <Text>Woman</Text>
                                </View>
                            </Left>
                            <Right>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={woman ? "#f5dd4b" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => Advent('Woman')}
                                    value={woman}
                                />
                            </Right>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <View>
                                    <Text>Children</Text>
                                </View>
                            </Left>
                            <Right>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={children ? "#f5dd4b" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => Advent('Children')}
                                    value={children}
                                />
                            </Right>
                        </ListItem>
                        {/* <ListItem noBorder>
                            <Left>
                                <H2>Cancellation flexibility</H2>
                            </Left>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <View>
                                    <Text>Cancellation flexibility</Text>
                                    <Text style={{marginTop:5}} note>Only show stays that offer cancellation flexibility</Text>
                                </View>
                            </Left>
                            <Right>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={Cancellation ? "#f5dd4b" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={setCancellation}
                                    value={Cancellation}
                                />
                            </Right>
                        </ListItem> */}
                        
                        <ListItem>
                            <View>
                                <H2>Price range</H2>
                                <Text>${multiSliderValue[0]} - ${multiSliderValue[1]}</Text>
                                <Text note>The average nightly price is $40</Text>
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
                                <H2>Renter Rating</H2>
                            </Left>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <StarRating
                                    disabled={false}
                                    fullStarColor={colors.saagColor}
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
                                labelColor={colors.black}
                                textColor={colors.black}
                                borderBottomColor={colors.black}
                                inputType="email"
                                placeholderTextColor={colors.black}
                                placeholder="Tokyo, Japan"
                                customStyle={{ marginBottom: 30,marginTop:20,marginLeft:10 }}
                                onChangeText={(text) => setLocation(text)}
                                value={location}
                                autoFocus
                            />
                        </View>
                        {/* <ListItem onPress={() => calenderModal()}>
                            <Input value={dataSelected} />
                            <Button onPress={() => calenderModal()} >
                                <Text>Select Date</Text>
                            </Button>
                        </ListItem> */}
                    </List>
                </Content>
                <View style={{flexDirection:'row', borderTopColor:'black', borderTopWidth:1, marginBottom:5}}>
                        <View style={{marginTop:10}}>
                            <Button onPress={() => allClear()}  transparent>
                                <Text style={{color:colors.saagColor}}>Clear all</Text>
                            </Button>
                        </View>
                        <Button onPress={() => checkAvail()} style={{position:"absolute",marginTop:5, bottom:0, right:20, backgroundColor:colors.saagColor}} dark>
                            <Text>Check Availability</Text>
                        </Button>
                </View>
            </Container>
    )
}

export default FilterModal