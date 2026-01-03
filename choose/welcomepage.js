// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
  const db = getFirestore(app);


const artisanBtn = document.getElementById("artisan-room");
const serviceBtn = document.getElementById("service-room");
const profidisplayContainer = document.getElementById("displaying");
const workerBtnContainer = document.getElementById("worker-btn-div");
const profiSelect = document.getElementById("skillSelect");
const chooseBtnDiv = document.getElementById("choose-btn-div");
const appName = document.getElementById("app-name");
const loginModal = document.getElementById("login-modal");
const maps = document.getElementById("maps");
const body = document.body;


artisanBtn.addEventListener("click", () => {
 window.location.href = "formpage.html?type=artisan"
    
})


serviceBtn.addEventListener("click", (e) => {
 body.style.background = "white"; 
 chooseBtnDiv.style.display = "none";   
 workerBtnContainer.style.display = "block";
 appName.style.display = "none";
 loginModal.style.display = "none";
 maps.style.display = "block";

 if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const map = L.map("map").setView([lat, lon], 13);
            
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
                {
                    maxZoom: 19,
                    attribution:
                    '&copy:<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                }).addTo(map);
                L.marker([lat, lon])
                .addTo(map)
                .bindPopup(" You are here!")
                .openPopup();
                map.invalidateSize()
        },
        (error) => {
            alert("Unable to retrieve your location: " + error.message);
        });
}else{
    alert("Geolocation is not supported by your browser.")
}
})

async function professionalDisplay(skill){
    const normalised = skill.trim().toLowerCase();

    try {
        const q = query(collection(db, "workers"), where("skill", "==", normalised));
        const querySnapshot = await getDocs(q);
        profidisplayContainer .innerHTML = "";

        if(querySnapshot.empty){
            profidisplayContainer.innerHTML = `<p>No ${skill}s found.`;
        }else{
            querySnapshot.forEach(doc => {
                const p = doc.data();
                profidisplayContainer.innerHTML += `
            <div class="now-displaying-div">
            <div class="container">
            ${p.photo ? `<img src="${p.photo}" alt="${p.firstName}" style="max-width:100px;"/>` : `<i class="bi bi-person-fill"></i>`}
            </div>
            <div class="now-displaying-text-div">
                <p class="now-displaying-text">Name: ${p.firstName} ${p.lastName}</p>
                <p class="now-displaying-text">Email: ${p.Email  || 'N/A'}</p>
                <p class="now-displaying-text">Phone: ${p.Mobile || 'N/A'}</p>
                </div>
            </div>`;
            })
        }
    }catch(err){
        console.error(err);
        profidisplayContainer.innerHTML = `<p>Error loading workers. Try again later.<p/>`;
    }
}

profiSelect.addEventListener("change", (e) =>{
    const artisan = e.target.value; 

    if(artisan){
       professionalDisplay(artisan); 
    }else{
       profidisplayContainer.innerHTML = "";
    }
})