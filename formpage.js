 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7Ems5YjSzOaMultBBoev_foY81UFE1Tg",
  authDomain: "handyman-fa6e2.firebaseapp.com",
  projectId: "handyman-fa6e2",
  storageBucket: "handyman-fa6e2.firebasestorage.app",
  messagingSenderId: "302751967631",
  appId: "1:302751967631:web:327ae083a342fa9952c3fa"
};

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const storage = getStorage(app);

const form = document.getElementById("form-inputs");
const firstName = document.getElementById("name-input");
const lastName = document.getElementById("surname-input");
const dob = document.getElementById("birth-input");
const email = document.getElementById("email-input");
const phoneNo = document.getElementById("number-input");
const address = document.getElementById("address-input");
const optField = document.getElementById("sel");
const $dropdown = document.getElementById("dropdown");
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");
const photoPlaceholder =  document.getElementById("photo-placeholder");
const formArea =  document.getElementById("form-area");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");
const passwordDiv = document.getElementById("passwordDiv");
const nextBtc = document.getElementById("nextbtc");
const backBtn = document.getElementById("backBtn");


let error = ["*Please fill in your first name!", 
            "*Please fill in your last name!", 
            "*Please enter date of birth!", 
            "*Please enter email address!", 
            "*Please enter phone number!", 
            "*Please fill in your address!"
        ];
let inputObj = {};

function isEmailValid(email){
  const regex = /^[\w.-]+@[\w-]+(\.[a-zA-Z]{2,})+$/;
  return regex.test(email);
}

//applying color chanage to page
window.addEventListener("DOMContentLoaded",  () =>{
  const params = new URLSearchParams(window.location.search);

  const type = params.get("type");

  if(type === "artisan"){
    document.body.style.background = "linear-gradient(to top, #3f3720ff, #20553fec)";
  
  }else if(type === "service"){
    document.body.style.backgroundColor = "green"

  }else{
    document.body.style.backgroundColor = "white"

  }
}
)

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if(!file){
    photoPreview.style.display = "none";
    photoPlaceholder.style.display = "";
    photoPreview.src = "";
    return;
  }
  const url = URL.createObjectURL(file);
  photoPreview.src = url;
  photoPreview.style.display = "";
  photoPreview.style.display = "none";
  photoPreview.onload = () => URL.revokeObjectURL(url);
})        

phoneNo.addEventListener("input", (e) =>{
  let telNoValue = e.target.value.replace(/\D/g, "");
  if(telNoValue.length > 3  && telNoValue.length <= 5){
    telNoValue = telNoValue.slice(0, 3) + "-" + telNoValue.slice(3);
  }else if(telNoValue.length > 5){
  telNoValue = telNoValue.slice(0, 3) + "-" + telNoValue.slice(3, 5) + "-" + telNoValue.slice(5);
  }
  e.target.value = telNoValue
})
nextBtc.addEventListener("click", (e) => {
   e.preventDefault();
if(!firstName.value){
    document.getElementById("error1").innerText = error[0];
return
}else{
     document.getElementById("error1").innerText = "";
}
 if(!lastName.value){
      document.getElementById("error2").innerText = error[1];
return    
}else{
document.getElementById("error2").innerText = "";
}
if(!dob.value){
document.getElementById("error3").innerText = error[2];
return    
}else{
document.getElementById("error3").innerText = "";
}
if(!email.value){
  document.getElementById("error4").innerText = error[3];
  return;
}else if(!isEmailValid(email.value)){
  document.getElementById("error4").innerText = "Invalid email format.";
  return;
}else{
   document.getElementById("error4").innerText = "";
}

if(!phoneNo.value){
document.getElementById("error5").innerText = error[4];
return;
}else{
document.getElementById("error5").innerText = "";
}

if(!address.value){
document.getElementById("error6").innerText = error[5];
return
}else{
document.getElementById("error6").innerText = "";
}
if($dropdown.selectedIndex === 0){
optField.style.display = "block"
return
}else{
optField.style.display = "none";
}  

 inputObj = {
        skill: $dropdown.value,
        firstName: firstName.value,
        lastName: lastName.value,
        birthDate: dob.value,
        Email: email.value,
        Mobile: phoneNo.value,
        Address: address.value,
}; 

formArea.style.display = "none";
passwordDiv.style.display = "block";

});

backBtn.addEventListener("click", () => {
  formArea.style.display = "block";
passwordDiv.style.display = "none";
})

form.addEventListener("submit", async (e) => {
  e.preventDefault();
if(!password.value){
  document.getElementById("passwordError").innerHTML = "Please enter password.";
  return;
}else if(password.value !== passwordConfirm.value){
  document.getElementById("passwordError").innerHTML = "";
  document.getElementById("passwordError").innerHTML = "Passwords didn't match.";
  return;
}else{
  document.getElementById("passwordError").innerHTML = "";
}
let user;
let photoURL = "";

try {
  const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
  user = userCredential.user;
  console.log("User created successfully:", user.uid);
}catch (error){
  console.error("Signup error:", error.code, error.message);
  let message = "";
  switch(error.code){
    case "auth/email-already-in-use":
    message = "This email is already registered.";
    break;
    case "auth/invalid-email":
      message = "This email address is invalid.";
      break;
    case "auth/weak-password":
      message = "Password should be at least 6 characters.";
      break;
      case "auth/network-request-failed":
        message = "Network error. Please check your connection.";
        break;
        default:
        message ="An unexpected error occured:" + error.message;
    }
    document.getElementById("successfull-msg").innerText = message; 
    return;
  }
  //handling image upload
try{
const file = photoInput.files[0];
if(file){
  const storageRef = ref(storage, `user_photos/${user.uid}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  photoURL = await getDownloadURL(storageRef);
  console.log("Photo uploaded successfully:", photoURL); 
}else {
  console.log("No photo selected");
}

}catch (error){
  console.error("Phot upload failed:", error.code || error.message); 
  document.getElementById("successfull-msg").innerText = error.message || "An error occured while while uploading the photo.";
}

try {
  await addDoc(collection(db, "workers"), {
    uid: user.uid, ...inputObj, photoURL,
  });
  console.log("User data saved successfully!");
  alert("Account created successfully!");

}catch (error){
console.error("Firestore save failed:", error.message);
alert("Failed to save user data: " + error.message);
}
form.reset();
});


form.addEventListener("reset", () => {
    photoPreview.src = "";
    photoPreview.style.display = "none";
    photoPreview.style.display = "";
    photoInput.value = "";
})


