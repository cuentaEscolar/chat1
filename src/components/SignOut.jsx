function SignOut(props) {
    return props.Auth.currentUser && (
      
      <button onClick={() => props.Auth.signOut() }>Sign Out</button>
      )
    }
export default SignOut