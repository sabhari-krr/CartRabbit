document.addEventListener("DOMContentLoaded", function () {
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");
  const currentMonthHeader = document.getElementById("monthName");

  let currentDate = new Date();
  displayCalendar(currentDate);

  prevMonthButton.addEventListener("click", function () {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    displayCalendar(currentDate);
  });

  // Event listener for next month button
  nextMonthButton.addEventListener("click", function () {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    displayCalendar(currentDate);
  });

  function displayCalendar(date) {
    const monthOptions = {
      year: "numeric",
      month: "long",
    };
    currentMonthHeader.textContent = date.toLocaleDateString(
      undefined,
      monthOptions
    );

    // if (selectedCells.length > 0) {
    //     selectedCells.forEach(cell => {
    //         cell.style.backgroundColor = 'white';
    //     });
    //     selectedCells.length = 0
    //     updateSelectedCellInfo()
    // }

    var table = document.getElementById("mon-table");
    var tbody = table.getElementsByTagName("tbody")[0];

    for (var i = 0, row; (row = tbody.rows[i]); i++) {
      for (var j = 0, cell; (cell = row.cells[j]); j++) {
        cell.innerHTML = "";
        cell.setAttribute("data-time", "");
        cell.setAttribute("selected", "false");
      }
    }

    // Create a new date object for the first day of the month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // Get the number of days in the month
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    // Determine the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    let d = new Date(date.getFullYear(), date.getMonth(), 1);
    let n = 1;
    for (var i = 0, row; (row = tbody.rows[i]); i++) {
      for (var j = 0, cell; (cell = row.cells[j]); j++) {
        if (i == 0 && j < firstDayOfWeek) {
          continue;
        }
        if (n <= daysInMonth) {
          d.setDate(d.getDate() + 1);
          cell.innerHTML = n;
          cell.setAttribute("data-time", d.toISOString().slice(0, 10));
          cell.setAttribute("selected", "false");

          n++;
        } else {
          break;
        }
      }
    }
  }
});

const selectedCells = [];
const cells = document.querySelectorAll(".month");
const selectedCellInfo = document.getElementById("selectedCellInfo");
let isMouseDown = false;
let noofdays = 3;

function handleMouseDown(cell) {
  // console.log(selectedCells.length)
  // if(!selectedCells.length<=noofdays)
  // return;
  isMouseDown = true;
  cell.getAttribute("selected") === "false"
    ? cell.setAttribute("selected", true)
    : cell.setAttribute("selected", false);
  if (
    cell.getAttribute("selected") === "true" &&
    cell.getAttribute("data-time")
  ) {
    selectedCells.push(cell);
    cell.style.backgroundColor = "lightblue";
  } else if (cell.getAttribute("data-time")) {
    let i = selectedCells.indexOf(cell);
    selectedCells.splice(i, 1);
    cell.style.backgroundColor = "white";
  }
  updateSelectedCellInfo();
}

function handleMouseOver(cell) {
  // console.log(selectedCells.length)
  // if(!selectedCells.length<=noofdays)
  // return;
  if (!isMouseDown) return;
  if (
    cell.getAttribute("selected") === "false" &&
    !selectedCells.includes(cell) &&
    cell.getAttribute("data-time")
  ) {
    selectedCells.push(cell);
    cell.style.backgroundColor = "lightblue";
    cell.style.boxShadow =
      "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;";
    cell.setAttribute("selected", "true");
    updateSelectedCellInfo();
  } else if (cell.getAttribute("data-time")) {
    let i = selectedCells.indexOf(cell);
    selectedCells.splice(i, 1);
    cell.style.backgroundColor = "white";
    cell.setAttribute("selected", "false");
    updateSelectedCellInfo();
  }
}

function handleMouseUp(cell) {
  isMouseDown = false;
}
let selectedTimes = [];

function updateSelectedCellInfo() {
  selectedTimes = selectedCells.map((cell) => cell.getAttribute("data-time"));
  selectedCellInfo.innerHTML = `Selected Time Range: ${selectedTimes.join(
    " - "
  )}`;
}

cells.forEach((cell) => {
  cell.addEventListener("mousedown", () => {
    handleMouseDown(cell);
  });

  cell.addEventListener("mouseover", () => {
    handleMouseOver(cell);
  });

  cell.addEventListener("mouseup", () => {
    handleMouseUp(cell);
  });
});
