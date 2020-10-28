import React from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'


export function LoginUser(email, password){
    console.log("email, password",email, password)
    return auth().signInWithEmailAndPassword(email, password)
    .then(()=>{
    //   resolve(true)
        return (true)
    }).catch(error => {
        // this.setState({
        //   validPassword: false,
        //   formValid: false,
        //   loadingVisible: false
        // })
    });
}

export async function  getUSERID(email, password){
    return new Promise((resolve, reject)=>{
        auth().onAuthStateChanged(user => {
            if (user) {
              resolve(user.uid)
            }
          })
    })
}

export async function getItemList(){
    return new Promise((resolve, reject)=>{
        firestore().collection('ItemList')
        .limit(20)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          if(data.length > 0){
            resolve(data)
          }
        });
      })
}

export async function getSavedItem(){
    const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('SavedPlaces')
      .where('userID', '==', ID)
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

export async function mergeList(lists){
    const result = [{
        'title':'Trending',
        'Listing':[]
      },{
        'title':'Wanted',
        'Listing':[]
      }]
      return new Promise((resolve, reject)=>{
        const response = lists.filter((item,index)=>{
          if(item.segmenttype === "Trending"){
            result[0].Listing.push(item)
          } else if(item.segmenttype === "Wanted"){
            result[1].Listing.push(item)
          }
        })
        resolve(result)
      })
}

export async function getUSERDATA(userID){
    const result = []
    return new Promise((resolve, reject)=>{
        firestore()
          .collection('Users')
          .where('uid', '==', userID)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
              result.push(documentSnapshot.data())
            });
            resolve(result)
          });
      })
}

export async function getUSERDOC(userID){
    return new Promise((resolve, reject)=>{
        firestore().collection('Users').where('uid', '==',userID).get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            resolve(doc.id)
          });
      })
    })
}

export async function updateUser(photourl, userDetail, userLocation, userLanguage, userWork, docID){
    return new Promise((resolve, reject)=>{
        firestore().collection('Users').doc(docID).update({
            photo: photourl,
            userDetail: userDetail,
            userLocation: userLocation,
            userLanguage: userLanguage,
            userWork: userWork
          }).then(() => {
            resolve(true)
        })
        .catch(e =>{
            resolve(false)
        })
    })
}

export async function updateUserEdit(gender, PhoneNumber, DoB, Email, receiveEmail,FirstName, docID){
    return new Promise((resolve, reject)=>{
        firestore().collection('Users').doc(docID).update({
          Gender: gender,
          PhoneNumber: PhoneNumber,
          DoB: DoB,
          email: Email,
          receiveEmail: receiveEmail,
          firstName: FirstName
        }).then(() => {
            resolve(true)
        })
        .catch(e =>{
            resolve(false)
        })
    })
}

export async function updateWorkEmail(email, docID){
    return new Promise((resolve, reject)=>{
        firestore().collection('Users').doc(docID).update({
            workEmail: email
        }).then(() => {
            resolve(true)
        })
        .catch(e =>{
            resolve(false)
        })
    })
}

export async function addOrderList(location, title, price1,NotfixedPrice, priceResT, userName, type, ID, details, priceType, userID){
    return new Promise((resolve, reject)=>{
        firestore()
          .collection("ItemList")
            .add({
                location: location,
                title: title,
                price1: price1,
                priceResT:NotfixedPrice ? priceResT : price1,
                userName:userName,
                type: type,
                id: ID,
                totalRating:0,
                segmenttype:'Trending',
                details:details,
                priceType: priceType,
                userID: userID
            })
          .then(()=>{
            resolve(true)
        })
    })
}

export async function getOrderDOC(ID){
    return new Promise((resolve,reject)=>{
        firestore().collection('ItemList').where('id','==', ID)
        .get()
        .then(querySnapshot=>{
            querySnapshot.docs.map((item)=>{
                resolve(item.id)
            })
        })
    })
}

export async function addFeedBack(feedBack, emailAddress, userID){
    return new Promise((resolve, reject)=>{
        firestore().collection('FeedBacks').add({
            feedBack: feedBack,
            Topic: emailAddress,
            userID: userID,
        }).then(() => {
            resolve(true)
        })
        .catch(()=>{
            resolve(false)
        })
    })
}

export async function addOrder(userID,ID,listing,startDate,endDate, totalPrice){
    return new Promise((resolve, reject)=>{
        console.log("Order Now", userID, ID, listing, startDate, endDate, totalPrice)
        firestore().collection('Orders')
        .add({
                renterID: userID,
                supplierID: listing.userID,
                startDate:startDate,
                endDate:endDate,
                itemID: listing.id,
                orderID: ID,
                isCompleted: false,
                totalPrice: totalPrice,
            })
            .then(() => {
                resolve(true)
            })
            .catch(e =>{
                resolve(false)
            })
    })
}