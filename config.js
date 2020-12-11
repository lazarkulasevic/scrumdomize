var firebaseConfig = {
	apiKey: "AIzaSyC5GnKMLQNaFin_doJVJGKH7wtxjjseOtU",
	authDomain: "scrumdomize.firebaseapp.com",
	projectId: "scrumdomize",
	storageBucket: "scrumdomize.appspot.com",
	messagingSenderId: "115144458232",
	appId: "1:115144458232:web:5db83767db4aaf91a5200d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export let pass = 'scrum';

let db = firebase.firestore();

export default db;