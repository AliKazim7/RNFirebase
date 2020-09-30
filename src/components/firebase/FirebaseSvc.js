import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

class Fire{
    constructor(){
        this.observeAuth()
    }

observeAuth = () =>{
    auth().onAuthStateChanged(this.onAuthStateChanged)
}

onAuthStateChanged = user =>{
    if(!user){
        try{
            auth().onAuthStateChanged()
        } catch(error){

        }
    }
}

    get ref(){
        return firestore().collection('Chats')
    }

    // on = callback = this.ref
    // this.ref
    // .limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));

    parse= snapshot =>{
        const { text, user } = snapshot.val();
        const { key: _id } = snapshot;
        
        // 3.
        const message = {
            _id,
            text,
            user,
        };
        return message;
    }
      get uid() {
        return (auth().currentUser || {}).uid;
      }
      // 2.
      
      get user() {
        return {
            name: "Agha Ali Kazim",
            _id: Fire.shared.uid,
        };
      }

      // 3.
      send = messages => {
        for (let i = 0; i < messages.length; i++) {
          const { text, user } = messages[i];
          // 4.
          const message = {
            text,
            user,
          };
          this.append(message);
        }
      };
      // 5.
      append = message => this.ref.push(message);
}

Fire.shared = new Fire();
export default Fire;