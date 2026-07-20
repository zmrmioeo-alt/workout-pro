// ======================================
// Workout Pro v3
// Script.js
// ======================================

// -----------------------------
// صفحات
// -----------------------------

const pages = document.querySelectorAll(".page");
const menus = document.querySelectorAll(".menu");

menus.forEach(menu => {

    menu.onclick = () => {

        menus.forEach(btn => btn.classList.remove("active"));

        menu.classList.add("active");

        pages.forEach(page => page.classList.add("hidden"));

        document
            .getElementById(menu.dataset.page)
            .classList.remove("hidden");

    };

});

// -----------------------------
// ساعت و تاریخ
// -----------------------------

function updateClock(){

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString("fa-IR");

    document.getElementById("date").innerHTML =
        now.toLocaleDateString("fa-IR");

    let hour = now.getHours();

    let text = "";

    if(hour < 12){

        text = "🌅 صبح بخیر";

    }

    else if(hour < 17){

        text = "☀️ ظهر بخیر";

    }

    else if(hour < 20){

        text = "🌇 عصر بخیر";

    }

    else{

        text = "🌙 شب بخیر";

    }

    document.getElementById("hello").innerHTML = text;

}

setInterval(updateClock,1000);

updateClock();

// -----------------------------
// شمارنده ها
// -----------------------------

let counter =
Number(localStorage.getItem("counter")) || 0;

let failedCounter =
Number(localStorage.getItem("failedCounter")) || 0;

document.getElementById("counter").innerHTML =
counter;

document.getElementById("failedCounter").innerHTML =
failedCounter;

// -----------------------------
// متغیرهای تمرین
// -----------------------------

let totalExercises = 0;

let doneExercises = 0;

let failedExercises = 0;

let currentDay = "";

let currentIndex = null;

// -----------------------------
// برنامه هفتگی
// -----------------------------

const workoutPlan = {

"شنبه":{

title:"💪 بالاتنه",

exercises:[

{name:"شنا سوئدی",sets:3,reps:10,rest:"60 ثانیه"},

{name:"بارفیکس",sets:3,reps:"تا ناتوانی",rest:"90 ثانیه"},

{name:"جلوبازو دمبل",sets:3,reps:12,rest:"60 ثانیه"},

{name:"پلانک",sets:3,reps:"40 ثانیه",rest:"45 ثانیه"}

]

},

"یکشنبه":{

title:"🦵 پا",

exercises:[

{name:"اسکوات",sets:4,reps:15,rest:"60 ثانیه"},

{name:"لانج",sets:3,reps:12,rest:"60 ثانیه"},

{name:"ساق پا",sets:4,reps:20,rest:"45 ثانیه"}

]

},

"دوشنبه":{

title:"😌 استراحت",

exercises:[

{name:"کشش بدن",sets:1,reps:"20 دقیقه",rest:"-"},

{name:"پیاده‌روی",sets:1,reps:"30 دقیقه",rest:"-"}

]

},

"سه‌شنبه":{

title:"🏋️ پشت",

exercises:[

{name:"بارفیکس",sets:4,reps:"تا ناتوانی",rest:"90 ثانیه"},

{name:"شنا دست جمع",sets:3,reps:10,rest:"60 ثانیه"},

{name:"دمبل خم",sets:3,reps:12,rest:"60 ثانیه"}

]

},
"چهارشنبه":{

title:"🔥 شکم",

exercises:[

{name:"کرانچ",sets:3,reps:20,rest:"45 ثانیه"},

{name:"بالا آوردن پا",sets:3,reps:15,rest:"45 ثانیه"},

{name:"پلانک",sets:3,reps:"60 ثانیه",rest:"45 ثانیه"}

]

},

"پنجشنبه":{

title:"⚡ کل بدن",

exercises:[

{name:"شنا",sets:3,reps:12,rest:"60 ثانیه"},

{name:"بارفیکس",sets:3,reps:"تا ناتوانی",rest:"90 ثانیه"},

{name:"اسکوات",sets:3,reps:15,rest:"60 ثانیه"}

]

},

"جمعه":{

title:"🌴 استراحت",

exercises:[

{name:"حرکات کششی",sets:1,reps:"20 دقیقه",rest:"-"}

]

}

};

// -----------------------------
// نمایش تمرین روز
// -----------------------------

function loadDay(day){

currentDay = day;

const data = workoutPlan[day];

totalExercises = data.exercises.length;

doneExercises = 0;

failedExercises = 0;

let html = `<h2>${data.title}</h2>`;

data.exercises.forEach((item,index)=>{

const doneKey = day+"_done_"+index;

const failKey = day+"_fail_"+index;

const isDone =
localStorage.getItem(doneKey)=="1";

const isFailed =
localStorage.getItem(failKey)=="1";

if(isDone){

doneExercises++;

}

if(isFailed){

failedExercises++;

}

html += `

<div class="exercise-card">

<h3>${item.name}</h3>

<p>

ست: ${item.sets}<br>

تکرار: ${item.reps}<br>

استراحت: ${item.rest}

</p>

<div class="exercise-actions">

<button
class="done-btn"

${isDone?"disabled":""}

onclick="finishExercise('${day}',${index},this)"

>

${isDone?"✅ انجام شد":"✔ انجام شد"}

</button>

<button

class="skip-btn"

${isFailed?"disabled":""}

onclick="openReason('${day}',${index})"

>

${isFailed?"❌ ثبت شد":"❌ انجام نشد"}

</button>

</div>

</div>

`;

});

document.getElementById("exerciseContainer").innerHTML = html;

updateProgress();

}

// -----------------------------
// تمرین انجام شد
// -----------------------------

function finishExercise(day,index,btn){

const key = day+"_done_"+index;

if(localStorage.getItem(key)){

return;

}

localStorage.setItem(key,"1");

counter++;

doneExercises++;

localStorage.setItem("counter",counter);

document.getElementById("counter").innerHTML = counter;

btn.innerHTML = "✅ انجام شد";

btn.disabled = true;

updateProgress();

}
// -----------------------------
// باز کردن پنجره دلیل انجام نشدن
// -----------------------------

function openReason(day,index){

currentDay = day;

currentIndex = index;

document
.getElementById("reasonModal")
.classList
.remove("hidden");

document
.getElementById("reasonSelect")
.selectedIndex = 0;

document
.getElementById("customReason")
.value = "";

}

// -----------------------------
// بستن پنجره
// -----------------------------

function closeReason(){

document
.getElementById("reasonModal")
.classList
.add("hidden");

}

// -----------------------------
// ذخیره دلیل
// -----------------------------

document
.getElementById("saveReason")
.onclick = function(){

let reason =
document.getElementById("reasonSelect").value;

const custom =
document.getElementById("customReason").value.trim();

if(reason==""){

alert("ابتدا دلیل را انتخاب کن.");

return;

}

if(reason=="دلیل دیگر" && custom!=""){

reason = custom;

}

const failKey =
currentDay+"_fail_"+currentIndex;

const reasonKey =
currentDay+"_reason_"+currentIndex;

localStorage.setItem(failKey,"1");

localStorage.setItem(reasonKey,reason);

localStorage.setItem("lastReason",reason);

failedCounter++;

failedExercises++;

localStorage.setItem(
"failedCounter",
failedCounter
);

document.getElementById("failedCounter").innerHTML =
failedCounter;

document.getElementById("lastReason").innerHTML =
reason;

closeReason();

loadDay(currentDay);

};

// -----------------------------
// انصراف
// -----------------------------

document
.getElementById("cancelReason")
.onclick = function(){

closeReason();

};

// -----------------------------
// بروزرسانی پیشرفت
// -----------------------------

function updateProgress(){

let percent = 0;

if(totalExercises>0){

percent = Math.round(

(doneExercises/totalExercises)*100

);

}

document.getElementById("progressBar").style.width =
percent+"%";

document.getElementById("progressText").innerHTML =
percent+"%";

document.getElementById("progressBar2").style.width =
percent+"%";

document.getElementById("progressPercent").innerHTML =
percent+"%";

document.getElementById("doneCount").innerHTML =
doneExercises;

document.getElementById("notDoneCount").innerHTML =
failedExercises;

document.getElementById("remainCount").innerHTML =
totalExercises-doneExercises-failedExercises;

}
// -----------------------------
// تمرین امروز
// -----------------------------

const weekDays = [
"یکشنبه",
"دوشنبه",
"سه‌شنبه",
"چهارشنبه",
"پنجشنبه",
"جمعه",
"شنبه"
];

const todayName = weekDays[new Date().getDay()];

if(document.getElementById("todayContainer")){

const today = workoutPlan[todayName];

if(today){

let html = `

<div class="card">

<h2>${today.title}</h2>

`;

today.exercises.forEach(item=>{

html += `

<p>

💪 ${item.name}

<br>

${item.sets} ست | ${item.reps}

</p>

<hr>

`;

});

html += `

</div>

`;

document.getElementById("todayContainer").innerHTML =
html;

}

}

// -----------------------------
// حالت شب / روز
// -----------------------------

let darkMode =
localStorage.getItem("darkMode") || "dark";

applyTheme();

document
.getElementById("darkBtn")
.onclick = function(){

darkMode =
darkMode=="dark" ? "light" : "dark";

localStorage.setItem(
"darkMode",
darkMode
);

applyTheme();

};

function applyTheme(){

if(darkMode=="dark"){

document.body.style.background="#101010";
document.body.style.color="white";

}else{

document.body.style.background="#f4f4f4";
document.body.style.color="#111";

}

}

// -----------------------------
// پاک کردن اطلاعات
// -----------------------------

document
.getElementById("resetBtn")
.onclick = function(){

const ok = confirm(

"تمام اطلاعات پاک شود؟"

);

if(!ok){

return;

}

localStorage.clear();

location.reload();

};

// -----------------------------
// آخرین دلیل
// -----------------------------

const lastReason =

localStorage.getItem("lastReason");

if(lastReason){

document.getElementById("lastReason").innerHTML =
lastReason;

}

// -----------------------------
// آخرین روز انتخاب شده
// -----------------------------

const oldLoadDay = loadDay;

loadDay = function(day){

localStorage.setItem(
"lastDay",
day
);

oldLoadDay(day);

};

const lastDay =

localStorage.getItem("lastDay");

if(lastDay && workoutPlan[lastDay]){

loadDay(lastDay);

}

// -----------------------------
// پایان فایل
// -----------------------------