// Initialize Firebase

var firebaseConfig = {
  apiKey: "AIzaSyAjdarRIsUshhdQOwaFLxlBneFWz12JrTU",
  authDomain: "chcwcup.firebaseapp.com",
  databaseURL: "https://chcwcup.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);


var firebaseuiContainer = new firebaseui.auth.AuthUI(firebase.auth());
