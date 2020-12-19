var config = {
	apiKey: `${${{ secrets.API_KEY }}}`,
	authDomain: "scrumdomize.firebaseapp.com",
	projectId: "scrumdomize",
	storageBucket: "scrumdomize.appspot.com",
	messagingSenderId: "115144458232",
	appId: "1:115144458232:web:5db83767db4aaf91a5200d",
	pass: "scrum"
};

firebase.initializeApp(config);

let db = firebase.firestore();

const base = db.collection('scrumdomize');

const form = document.getElementById('form');
const inputUser = document.getElementById('user');
const numbers = document.querySelector('.grid');
const numAll = document.querySelectorAll('.num');
const users = document.getElementById('users');
const repeat = document.getElementById('repeat');

getSelected();

let user, docID;
form.addEventListener('submit', event => {
	event.preventDefault();

	user = inputUser.value;
	docID = user + Math.floor(Math.random() * 10000);

	console.log(user)

	if (user != "" && user != null && user != undefined) {
		base.doc(docID).set({
			name: user,
			number: 0,
			type: 'person'
		});
	} else {
		return alert('You must enter your name first.')
	}

	numbers.style.visibility = "visible";
	form.style.visibility = "hidden";
});

numbers.addEventListener('click', event => {
	if (event.target.getAttribute('class').includes('num') 
	&& !event.target.getAttribute('class').includes('selected')) {

		base.doc(docID).update({
			number: Number(event.target.textContent)
		});

		let rnd = Math.floor(Math.random() * 10) + 1;
		base.doc('random').update({
			random: rnd
		});

		selfCleaning();
	}
});

repeat.addEventListener('click', () => {
	if (prompt('Enter password: ') == config.pass) {
		repeatProcess();
		let i = 0;
		let trAll = document.querySelectorAll('tr');
		let usersDelete = setInterval(() => {
			!trAll[i] ? clearInterval(usersDelete) :
			trAll[i].remove();
			i++;
		}, 300)
	}
});

async function getSelected() {
	let counter = 1;

	base
	.where('number', '!=', 0)
	.onSnapshot(snapshot => {
		snapshot.docChanges().forEach(change => {
			if (change.type == 'modified' || change.type == 'added') {
				numAll.forEach(num => {
					if (num.textContent == change.doc.data().number) {
						num.classList.add('selected');
					}
				});

				if (change.doc.data().name) {
					userUI(users, counter, change.doc.data().name, change.doc.data().number);
					counter++;
				}
			}

			if (snapshot.size == 10) {
				scrumdomize();
			}
		});
	});
}

function userUI(parent, counter,name, num) {
	let userRow = document.createElement('tr');

	let order = document.createElement('td');
	let orderNum = document.createTextNode(counter);
	order.appendChild(orderNum);

	let nameTd = document.createElement('td');
	let userData = document.createTextNode(name);
	nameTd.appendChild(userData);
	
	let numTd = document.createElement('td');
	let userNum = document.createTextNode(num);
	numTd.appendChild(userNum);

	userRow.appendChild(order);
	userRow.appendChild(nameTd);
	userRow.appendChild(numTd);
	
	parent.appendChild(userRow);
}

function selfCleaning() {
	base
	.where('number', '==', 0)
	.get()
	.then(docs => {
		docs.forEach(doc => {
			doc.ref.delete();
		});
	});
}

function scrumdomize() {
	base.doc('random').get()
	.then(doc => showScrummer(doc.data().random));
}

function showScrummer(number) {
	const tdAll = document.querySelectorAll('td');

	tdAll.forEach((cell, i) => {
		if (i % 3 == 2 && Number(cell.textContent) == Number(number)) {
			cell.parentElement.setAttribute('class', 'scrummer');
		}
	})
}

function repeatProcess() {
	base
	.where('type', '==', 'person')
	.get()
	.then(docs => {
		docs.forEach(doc => {
			doc.ref.delete();
		});
	});
}