import React from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

export async function getCategories(){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection("Categories")
    .get()
    .then((querySnapshot)=>{
      querySnapshot.forEach(documentSnapshot => {
        result.push(documentSnapshot.data())
      });
      resolve(result)
    })
  })
}


export async function createUser(emailAddress, password){
    return new Promise((resolve, reject)=>{
      auth().createUserWithEmailAndPassword(emailAddress, password)
        .then((response) =>{
          resolve(response.user.uid )
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            resolve(false)
          }
          if (error.code === 'auth/invalid-email') {
            resolve(false)
          }
        });
    })
}

export async function userProfile(firstName, emailAddress, password, receiveEmail, uid){
  return new Promise((resolve, reject)=>{
    firestore().collection('Users').add({
      firstName: firstName,
      email: emailAddress,
      password: password,
      accountCreate:moment().format("MMMM , YYYY"),
      receiveEmail: receiveEmail,
      supplierRating:0,
      renterRating:0,
      uid: uid,
      role: 'client'
    }).then((response) => {
      resolve(response)
    });
  })
}

export function LoginUser(email, password){
    return auth().signInWithEmailAndPassword(email, password)
    .then(()=>{
        return (true)
    }).catch(error => {
    });
}

export async function  getUSERID(){
  return new Promise((resolve, reject)=>{
    auth().onAuthStateChanged(user => {
    if(user){
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

export async function getSavedItem(ID){
    const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('SavedItems')
      .where('userID', '==', ID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
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
      },{
        'title':'All Listings',
        'Listing':[]
      }]
      return new Promise((resolve, reject)=>{
        const response = lists.filter((item,index)=>{
          if(item.segmentType === "Trending"){
            result[0].Listing.push(item)
          }  
          if(item.segmentType === "Wanted"){
            result[1].Listing.push(item)
          }
          if(item){
            item.segmentType === "All"
            result[2].Listing.push(item)
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
          .onSnapshot(function(doc) {
            resolve(doc.docs[0].data())
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
    gender: gender,
    phone: PhoneNumber,
    DOB: DoB,
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

export async function addOrderList(location, title, price1,NotfixedPrice, priceResT, userName, type, details, priceType, userID, photo){
    return new Promise((resolve, reject)=>{
        firestore()
          .collection("ItemList")
            .add({
                location: location,
                locationLower:location.toLowerCase(),
                title: title,
                titleLower: title.toLowerCase(),
                price1: Number(price1),
                priceResT:NotfixedPrice ? Number(priceResT) : Number(price1),
                userName:userName,
                type: type,
                totalRating:0,
                segmentType:'Wanted',
                details:details,
                priceType: priceType,
                userID: userID,
                photo:photo
            })
          .then((response)=>{
            firestore().collection("ItemList").doc(response.id).update({
              id:response.id
            }).then((res) =>{
              resolve(response.id)
            })
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
      firestore().collection('OrderItems')
      .add({
        renterID: userID,
        supplierID: listing.userID,
        startDate:new Date(startDate),
        endDate:new Date(endDate),
        itemID: listing.id,
        orderID: ID,
        isCompleted: false,
        totalPrice: totalPrice,
      })
      .then((response) => {
        resolve(response)
      })
      .catch(e =>{
        resolve(false)
      })
    })
}

export async function saveItems(userID){
  return new Promise((resolve, reject)=>{
    firestore().collection('SavedItems')
      .add({
        userID: userID,
        saved:[]
      })
      .then((response) => {
        firestore().collection('SavedItems')
        .doc(response.id).update({
          savedID: response.id
        })
        .then((results)=>{
          resolve(true)
        })
      })
      .catch(e =>{
        resolve(false)
      })
  })
}

export async function getSegmentData(type){
  const result = []
  return new Promise((resolve, reject)=>{
      firestore().
      collection('ItemList').
      where('segmentType', '==',type)
      .limit(20)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          result.push(doc.data())
      });
      resolve(result)
    })
  })
}

export async function getAllItems(){
  const result = []
  return new Promise((resolve, reject)=>{
      firestore().
      collection('ItemList')
      .limit(20)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          result.push(doc.data())
      });
      resolve(result)
    })
  })
}

export async function getListedItem(num){
  const result = []
  return new Promise((resolve, reject)=>{
      firestore().
      collection('ItemList')
      .limit(num)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          result.push(doc.data())
      });
      resolve(result)
    })
  })
}


export async function SaveItemData(userID, listing){
  return new Promise((resolve, reject)=>{
    firestore().
    collection('SavedItems').
    where("userID",'==',userID)
    .get()
    .then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
        const saved = doc.data().saved
        saved.push(listing)
        firestore().
        collection('SavedItems').
        doc(doc.id).
        update({
          saved: saved
        })
        .then(response =>{
          resolve(true)
        })
     })
    })
    .catch((e)=>{
        resolve(false)
    })
})
}

export async function getSavedValues(ID){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('ItemList')
    .where('id', '==', ID)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        resolve(documentSnapshot.data())
        // result.push(documentSnapshot.data())
      });
      // resolve(result)
    });
  })
}

export async function getCategoriesData(ID){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('ItemList')
    .where('id', '==', ID)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        resolve(documentSnapshot.data())
        // result.push(documentSnapshot.data())
      });
      // resolve(result)
    });
  })
}

export async function getAllCategoryItems(ID){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('ItemList')
    .where('type', '==', ID)
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

export async function getItemID(ID){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('ItemList')
    .where('id', '==', ID)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        result.push(documentSnapshot.data())
      });
      resolve(result)
    });
  })
}

export async function getRenterOrder(ID){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('OrderItems')
    .where('renterID', '==', ID)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        result.push(documentSnapshot.data())
      });
      resolve(result)
    });
  })
}

export async function setItemRating(itemData, newRatingProd){
    // if(itemData.totalRating > 0){
    //     const newRAT = ((itemData.totalRating * 5) + newRatingProd)/(5 + 1)
    //     return new Promise((resolve, reject)=>{
    //         firestore().collection('ItemList').doc(itemData.id).update({ 
    //             totalRating: newRAT
    //         })
    //         .then(()=>{
    //             resolve(true)
    //         })
    //     })
    // } else {
    //     const newRAT = newRatingProd
    //     return new Promise((resolve, reject)=>{
    //         firestore().collection('ItemList').doc(itemData.id).update({ 
    //             totalRating: newRAT
    //         })
    //         .then(()=>{
    //             resolve(true)
    //         })
    //     })
    // }
}
export async function addComments(itemData,renterData, Comments){
  return new Promise((resolve, reject)=>{
      firestore().collection("Comments").add({
          itemID: itemData.id,
          comment: Comments,
          renderID: renterData.uid,
          commentDate: moment().format('L'),
      })
      .then(()=>{
          resolve(true)
      })
  })
}

export async function mergeSaved(saved,lists){
  return new Promise((resolve, reject)=>{
    lists.forEach((item, index)=>{
      saved.forEach((i)=>{
        if(item.id === i){
          lists[index].favourite = true
        } else{
          lists[index].favourite = false
        }
      })
    })
    resolve(lists)
  })
}

export async function RemoveSaved(userID,itemID){
  return new Promise((resolve, reject)=>{
    firestore().
    collection("SavedItems").
    where("userID",'==',userID).
    get().
    then(querySnapshot =>{
      querySnapshot.forEach(documentSnapshot => {
        const array = documentSnapshot.data().saved
        const docID = documentSnapshot.data().savedID
        const result = array.filter((item,index)=>{
          return item !== itemID
        })
        firestore().
        collection('SavedItems').
        doc(docID).
        update({
          saved: result
        })
        .then(response =>{
          resolve(true)
        })
      });
    })
  })
}

export async function searchItems(category,location){
  const result = []
  return new Promise((resolve, reject)=>{
    if(location !== ''){
      firestore().
      collection("ItemList").
      where("location",'==',location).
      get().
      then(querySnapshot =>{
        querySnapshot.forEach(documentSnapshot => {
          if(category !== ''){
            if(documentSnapshot.data().type === category){
              result.push(documentSnapshot.data())
            } else {
            }
          } else {
            result.push(documentSnapshot.data()) 
          }
        });
        resolve(result)
      })
    } else {
      firestore().
      collection("ItemList").
      get().
      then(querySnapshot =>{
        querySnapshot.forEach(documentSnapshot => {
          if(category !== ''){
            if(documentSnapshot.data().type === category){
              result.push(documentSnapshot.data())
            } else {
            }
          } else {
            result.push(documentSnapshot.data()) 
          }
        });
        resolve(result)
      })
    }
  })
}

export async function getSupplierItem(ID){
  const result = []
  return new Promise((resolve, reject)=>{
    firestore().collection('ItemList')
    .where('userID', '==', ID)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        result.push(documentSnapshot.data())
      });
      resolve(result)
    });
  })
}

export async function getOrderSupplier(value){
  const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('OrderItems').where('supplierID','==', value)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          result.push(documentSnapshot.data())
        });
        resolve(result)
      })
    })
}
export async function displayRented(mainArray, orderArray){
  return new Promise((resolve, reject) =>{
    mainArray.forEach((item ,index)=>{
      orderArray.forEach((listing)=>{
        if(item.id === listing.itemID){
          mainArray[index].rented = true
        } else{
          mainArray[index].rented = false
        }
      })
    })
    resolve(mainArray)
  })
}

export async function getRenterChat(userID){
  const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('Chats').where('renterID','==', userID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          result.push(documentSnapshot.data())
        });
        resolve(result)
      })
    })
}

export async function getSupplierChat(userID){
  const result = []
    return new Promise((resolve, reject)=>{
      firestore().collection('Chats').where('supplierID','==', userID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          result.push(documentSnapshot.data())
        });
        resolve(result)
      })
    })
}

export async function getItemDetail(userID){
  return new Promise((resolve, reject)=>{
    firestore().collection('ItemList')
    .where('id', '==', userID)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        resolve(documentSnapshot.data())
        // result.push(documentSnapshot.data())
      });
      // resolve(result)
    });
  })
}


export async function getAllMessages(chatID){
  return new Promise((resolve, reject)=>{
    firestore()
    .collection("Chats")
    .doc(chatID)
    .onSnapshot(function(doc) {
      resolve(doc.data())
    });
  })
}

export async function getOrderItems(ID){
  const result = []
  return new Promise((resolve,reject)=>{
      firestore()
      .collection('OrderItems')
      .where('itemID','==', ID)
      .get()
      .then(querySnapshot => {
        if(querySnapshot.docs.length > 0){
          querySnapshot.forEach(documentSnapshot => {
            result.push(documentSnapshot.data())
          });
          resolve(result)
        } else {
          resolve([])
        }
      });
  })
}