import { Container, Header, Icon, Left, Right,Body, H1 } from 'native-base'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

export default class TermService extends React.Component{
    render(){
        return(
            <Container>
                <Header transparent>
                    <Left>
                        <Icon onPress={() => this.props.navigation.goBack()} type="AntDesign" name="arrowleft" />
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginLeft:20, marginRight:20}}>
                    <Text>
                    If your country of residence is outside of the EEA or the United Kingdom, your agreement with SAAG comprises the Terms of Service for Non-European Users.

If your country of residence is within the European Economic Area (“EEA”) or the United Kingdom, your agreement with SAAG comprises the Terms of Service for European Users.
                    </Text>

                    <Text style={{marginTop:10, marginBottom:10, fontSize:24}}>
                        Terms of Service
                    </Text>
                    <Text>
                        Please read these Terms of Service (“Terms”) carefully as they contain important information about your legal rights, remedies and obligations. By accessing or using the SAAG Platform, you agree to comply with and be bound by these Terms.
                        Please note: Section 19 of these Terms contains an arbitration clause and class action waiver that applies to all SAAG Members. If your country of residence is the United States, this provision applies to all disputes with SAAG. If your country of residence is outside of the United States, this provision applies to any action you bring against SAAG in the United States. It affects how disputes with SAAG are resolved. By accepting these Terms, you agree to be bound by this arbitration clause and class action waiver. Please read it carefully.
                    </Text>
                    <Text style={{fontWeight:'bold'}}>
                        Last Updated: November 1, 2019
                        Thank you for using SAAG!
                    </Text>
                    <Text>
                        These Terms constitute a legally binding agreement ("Agreement") between you and SAAG (as defined below) governing your access to and use of the SAAG website, including any subdomains thereof, and any other websites through which SAAG makes its services available (collectively, "Site"), our mobile, tablet and other smart device applications, and application program interfaces (collectively, "Application") and all associated services (collectively, "SAAG Services"). The Site, Application and SAAG Services together are hereinafter collectively referred to as the “SAAG Platform”. Our Host Guarantee Terms, Japan Host Insurance Terms, Guest Refund Policy, Nondiscrimination Policy and other Policies applicable to your use of the SAAG Platform are incorporated by reference into this Agreement.
                        When these Terms mention “SAAG,” “we,” “us,” or “our,” it refers to the SAAG company you are contracting with. Your contracting entity will generally be determined based on your country of residence or establishment.
                    </Text>
                    <Text style={{fontWeight:'bold'}}>
                        - If your country of residence or establishment is the United States, you are contracting with SAAG, Inc., 888 Brannan Street, 4th Floor, San Francisco, CA 94103, United States.
                        - If your country of residence or establishment is outside of the United States, the People’s Republic of China (which for purposes of these Terms does not include Hong Kong, Macau and Taiwan) (hereinafter “China”), Japan and the European Economic Area, you are contracting with SAAG Ireland UC (“SAAG Ireland”), The Watermarque Building, South Lotts Road, Ringsend, Dublin 4, Ireland.
                        - If your country of residence or establishment is in the European Economic Area or the United Kingdom, you are contracting with SAAG Ireland UC (“SAAG Ireland”), The Watermarque Building, South Lotts Road, Ringsend, Dublin 4, Ireland and your Agreement with SAAG is subject to the Terms of Service for European Users.
                        - If your country of residence or establishment is China, you are contracting with SAAG Internet (Beijing) Co., Ltd. (“SAAG China”) except where you book a Host Service (as defined below) or when you create a Listing located outside of China, in which case you are contracting with SAAG Ireland for that transaction.
                        - If your country of residence or establishment is Japan, you are contracting with SAAG Global Services Limited ("SAAG GSL"), 25-28 North Wall Quay, Dublin 1, D01 H104, Ireland, except where you book a Host Service (as defined below) or when you create a Listing located outside of Japan, in which case you are contracting with SAAG Ireland for that transaction.
                        - If you change your country of residence or establishment, the SAAG company you contract with will be determined by your new country of residence or establishment as specified above, from the date on which your country of residence changes.
                    </Text>
                    <Text>
                        Our collection and use of personal information in connection with your access to and use of the SAAG Platform is described in our Privacy Policy.
                    </Text>
                </ScrollView>
            </Container>
        )
    }
}