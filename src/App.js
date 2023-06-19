import React from 'react';
import { useRef } from 'react';
import {useState} from 'react';
import './App.css';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAllByTestId } from '@testing-library/react';
// import SignOut from './components/SignOut';

firebase.initializeApp({
  apiKey: "AIzaSyACXZzvTIs9CoMYnWAYcLjtzaDU3zcENy8",
  authDomain: "chat-test-c5947.firebaseapp.com",
  projectId: "chat-test-c5947",
  storageBucket: "chat-test-c5947.appspot.com",
  messagingSenderId: "84922347715",
  appId: "1:84922347715:web:a87fdd4f832dbfacb7b276",
  measurementId: "G-RQKF0M6J94"
})


const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function SigIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

// signOut goes here
function SignOut() {
  return auth.currentUser && (
    
    <button onClick={() => auth.signOut() }>Sign Out</button>
    )
}
  
function ChatRoom() { 
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);
  
  const [messages] = useCollectionData(query, {idField: 'id' });
  const [formValue, setFormValue] = useState('');
  
  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({ 
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  return (
    <>
    <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}>

        </div>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit">"ENTER"</button>
    </form>
    </>
    )
  }
function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received' ;
  return (
    <div className={`message ${messageClass}`}>
        <img src={photoURL}/>
        <p>{text}</p>
    </div>
  )
}
  
function App() {
  const [user] = useAuthState(auth);

  return (
  <div className="App">
  
    <link href="https://fonts.googleapis.com/css2?family=Parisienne&display=swap" rel="stylesheet"></link>
  <header className="App-header">
    
  <SignOut Auth={auth}/>
  </header>
  <section>
    {user ? <ChatRoom /> : <SigIn />}
  </section>
</div>
);
}

export default App;
