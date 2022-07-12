const calendarcontainer = document.querySelectorAll(".calendarcontainer");

      for (let i = 0; i < calendarcontainer.length; i++) {
        if (i != 0) {
          calendarcontainer[i].innerHTML = `<div class="yearcontrols row">
          <div class="col backbuttonCol">
            <button id="backButton${i}" class="btn btn-primary float-start">
              Back
            </button>
          </div>
          <div class="col">
            <div id="yearDisplay${i}" class="yearDisplay col-auto"></div>
          </div>
          <div class="col nextbuttonCol">
            <button id="nextButton${i}" class="btn btn-primary float-end">
              Next
            </button>
          </div>
        </div>
        <div id="calendar${i}" class="calendar row"></div>`;
        }
      }
      let clickCount = [];
      let monthCount = [];
      let ynav = [];
      let years = [];

      let clicks = null;
      let events = localStorage.getItem("events")
        ? JSON.parse(localStorage.getItem("events"))
        : [];

      const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const weekdaysNames = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const url = "http://localhost:5500/blocked.json";

      const LoadData = new Promise((resolve, reject) => {
        let done = true;
        if (done) {
          const data = fetch(url).then(function (result) {
            return result.json();
          });
          const getData = resolve(data);
        } else {
          reject();
        }
      });

      function load() {
        const dt = new Date();
        const day = dt.getDate();
        const month = dt.getMonth();

        for (let i = 1; i < calendarcontainer.length; i++) {
          const Ivalue = i;
          years[i] = new Date().getFullYear() + ynav[i];
          const year = years[i];

          document.getElementById("calendar" + i).innerHTML = "";
          document.getElementById("yearDisplay" + i).innerHTML = `${year}`;
          let calendar = document.getElementById("calendar" + i);
          const monthCounts = monthCount[i];
          for (let i = monthCounts; i < monthCounts + 3; i++) {
            const monthSquere = document.createElement("div");
            monthSquere.classList.add("month");
            calendar.appendChild(monthSquere);

            const monthName = document.createElement("div");
            monthName.classList.add("monthname");
            monthName.innerText = months[i];
            monthSquere.appendChild(monthName);

            for (let wd = 0; wd < weekdaysNames.length; wd++) {
              const weekdaysSquere = document.createElement("div");
              weekdaysSquere.classList.add("weekdays");
              weekdaysSquere.innerText = weekdaysNames[wd];
              monthSquere.appendChild(weekdaysSquere);
            }

            const firstDayOfMonth = new Date(year, i, 1);
            const daysInmonth = new Date(year, i + 1, 0).getDate();

            const dateString = firstDayOfMonth.toLocaleDateString("en-ie", {
              weekday: "long",
              year: "numeric",
              month: "numeric",
              day: "numeric",
            });

            const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
            const curentdayweek = weekdays.indexOf(dateString.split(", "));

            for (let d = 1; d <= paddingDays + daysInmonth; d++) {
              const daySquare = document.createElement("div");

              if (d > paddingDays) {
                daySquare.classList.add("day", `day${Ivalue}`);
                daySquare.innerText = d - paddingDays;
                const cDay = d - paddingDays;
                const forunix = new Date(`${year}/${i + 1}/${cDay}`);
                const unixTimestamp = Math.floor(
                  new Date(forunix).getTime() / 1000
                );

                daySquare.setAttribute("data-day", unixTimestamp);
                const weekdayN = new Date(year, i, cDay).toLocaleString(
                  "en-ie",
                  {
                    weekday: "long",
                  }
                );
                daySquare.classList.add(weekdayN);
              } else {
                daySquare.classList.add("padding");
                daySquare.innerText = " ";
              }

              monthSquere.appendChild(daySquare);
            }
          }

          LoadData.then((value) => {
            for (let i = 0; i < value.length; i++) {
              if (value[i].roomID == Ivalue)
                blockDates(
                  timefix(value[i].from),
                  timefix(value[i].to),
                  Ivalue
                );
            }
          }).catch((reject) => {
            console.log(error);
          });
        }
      }
      function blockDates(bFrom, bTo, classID) {
        var elementsA = (allHiddenElements = document.getElementsByClassName(
          `day${classID}`
        ));

        Array.prototype.forEach.call(elementsA, function (el) {
          // Do stuff here
          let nValue = el.getAttribute("data-day");
          if (nValue >= bFrom && nValue <= bTo) {
            //console.log(el.getAttribute('data-day'));
            el.classList.add("blocked");
          }
        });
      }
      function timefix(unixtime) {
        var date = new Date(unixtime * 1000);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        const data = Math.floor(
          new Date(`${year}/${month}/${day}`).getTime() / 1000
        );
        return data;
      }

      // ------------------------------
      function initButtons() {
        for (let i = 1; i < calendarcontainer.length; i++) {
          clickCount.push("clickCount" + i);
          clickCount[i] = 2;
          monthCount.push("monthCount" + i);
          monthCount[i] = 0;
          ynav.push("ynav" + i);
          ynav[i] = 0;
          years.push("year" + i);

          document
            .getElementById("nextButton" + i)
            .addEventListener("click", () => {
              if (clickCount[i] == 2) {
                clickCount[i] = clickCount[i] + 2;
                monthCount[i] = monthCount[i] + 2;
                load();
              } else if (clickCount[i] == 4) {
                clickCount[i] = clickCount[i] + 2;
                monthCount[i] = monthCount[i] + 2;
                load();
              } else if (clickCount[i] == 6) {
                clickCount[i] = clickCount[i] + 2;
                monthCount[i] = monthCount[i] + 2;
                load();
              } else if (clickCount[i] == 8) {
                clickCount[i] = clickCount[i] + 2;
                monthCount[i] = monthCount[i] + 2;
                load();
              } else if (clickCount[i] == 10) {
                clickCount[i] = clickCount[i] + 2;
                monthCount[i] = monthCount[i] + 2;
                load();
              } else {
                clickCount[i] = 2;
                monthCount[i] = 0;
                ynav[i]++;
                load();
              }
            });
          document
            .getElementById("backButton" + i)
            .addEventListener("click", () => {
              if (clickCount[i] == 12) {
                clickCount[i] = clickCount[i] - 2;
                monthCount[i] = monthCount[i] - 2;
                load();
              } else if (clickCount[i] == 10) {
                clickCount[i] = clickCount[i] - 2;
                monthCount[i] = monthCount[i] - 2;
                load();
              } else if (clickCount[i] == 8) {
                clickCount[i] = clickCount[i] - 2;
                monthCount[i] = monthCount[i] - 2;
                load();
              } else if (clickCount[i] == 6) {
                clickCount[i] = clickCount[i] - 2;
                monthCount[i] = monthCount[i] - 2;
                load();
              } else if (clickCount[i] == 4) {
                clickCount[i] = clickCount[i] - 2;
                monthCount[i] = monthCount[i] - 2;
                load();
              } else {
                clickCount[i] = 12;
                monthCount[i] = 10;
                ynav[i]--;
                load();
              }
            });
        }
      }

      // ------------------------------

      //
      initButtons();
      load();