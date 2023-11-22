/*
 * Practice on Elements
 */

// get all the hot class elements- change them to cool class

// $(".hot").each(function () {
//     $(this).removeClass("hot");
//     $(this).addClass("cool");
// });

// traverse the elements
// $("#two").next().next().text("Candy");

const firebaseConfig = {
    apiKey: "AIzaSyBLKAChIxXjfnJv2pF0j7odVf96qVVkqL8",
    authDomain: "cscia225.firebaseapp.com",
    projectId: "cscia225",
    storageBucket: "cscia225.appspot.com",
    messagingSenderId: "122711494384",
    appId: "1:122711494384:web:0a695ba2da3a5b669bbc35",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const existing = db
    .collection("shoppingList")
    .get()
    .then(thing => thing.docs.map(doc => doc.data().item));

existing.then(thing =>
    thing.forEach(str => $("#todo").append(`<li class="cool">${str}</li>`))
);

// Save the list to database
// $("#save").click(function () {
//     testing
//     db.collection("shoppingList").add({ item: "apple" });
// });

// add a new element by clicking the plus sign
$("#add").click(addElement);
// before and after are for siblings
// append and prepend are for parent

function addElement() {
    // add a new element
    // add a input text box
    $("#todo").append(
        "<li class='cool new'><input id='active' type='text'></li>"
    );
    // whenever the user are done add the element
    $("#active").blur(function () {
        var input = $(this).val();
        $(this).parent().addClass("cool");
        $(this).parent().text(input);
    });
}

// bind click with the event handler
$("body").on("click", "li", changeStyle);

//  click the li element will change the changeStyle
//  three style : complete, cool, hot
function changeStyle() {
    // if ($(this).hasClass("cool")) {
    //   $(this).removeClass("cool");
    //   $(this).addClass("warm");
    // } else if ($(this).hasClass("warm")) {
    //   $(this).removeClass("warm");
    //   $(this).addClass("hot");
    // } else {
    //   $(this).removeClass("hot");
    //   $(this).addClass("cool");
    // }

    $(this).hasClass("complete")
        ? $(this).removeClass("complete")
        : $(this).addClass("complete");

    if ($(this).hasClass("new")) {
        $(this).removeClass("new");
        $(this).removeClass("complete");
    }
}

// delete complete element by clicking the trash can
document.getElementById("remove").addEventListener("click", removeElement);

function removeElement() {
    // remove the marked elements  -- element with style complete
    $("li.complete").remove();
}

$("#save").click(handleSave);

let id;

function handleSave() {
    existing.then(imported => {
        id = imported.length;

        const current = Array.from(document.querySelectorAll("li")).map(
            $el => $el.innerText
        );

        const newStuff = current.filter(item => !imported.includes(item));

        newStuff.forEach(item => {
            db.collection("shoppingList").doc(String(id)).set({ item: item });
            id++;
            imported.push(item);
        });

        const deleted = imported.filter(
            importedItem => !current.includes(importedItem)
        );

        deleted.forEach(item =>
            db
                .collection("shoppingList")
                .doc(String(imported.indexOf(item)))
                .delete()
        );
    });
}
