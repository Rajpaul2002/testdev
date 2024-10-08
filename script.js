// Get the current date and calculate the previous week's dates (Monday to Friday)
const today = new Date();
const prevWeekDays = getPreviousWeekDays(today);
var selectedDaysArr = [];

// Event Listeners for Yes and No buttons
document.getElementById("yesButton").addEventListener("click", function () {
 // Exit the page (in most browsers, this may need user permission)
 displayCheckboxes();
 $(".card").addClass("hidden")
});

document.getElementById("noButton").addEventListener("click", function () {
  alert("Thank you for confirming!");
  window.close(); 
});

// Function to calculate previous week days (Monday to Friday)
function getPreviousWeekDays(date) {
  let days = [];
  let currentDay = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  let mondayOffset = (currentDay + 6) % 7; // Calculate Monday of the previous week

  for (let i = 0; i < 5; i++) {
    let prevDay = new Date(date);
    prevDay.setDate(date.getDate() - mondayOffset + i - 7); // Get dates from last Monday to Friday
    days.push({
      day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i],
      date: prevDay.toDateString(),
    });
  }
  return days;
}

// Function to display checkboxes for previous week days
function displayCheckboxes() {
  const form = document.getElementById("weekDaysForm");
  form.innerHTML = ""; // Clear any previous content
  prevWeekDays.forEach((day) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = day.date;
    checkbox.name = day.day;
    checkbox.value = `${day.day} (${day.date})`;

    const label = document.createElement("label");
    label.htmlFor = day.date;
    label.textContent = `${day.day} (${day.date})`;

    const br = document.createElement("br");

    form.appendChild(checkbox);
    form.appendChild(label);
    form.appendChild(br);
  });

  document.getElementById("daysForm").classList.remove("hidden");
  document.getElementById("submitDaysButton").classList.remove("hidden");
}

// Submit button logic to display selected days and store in JSON
document
  .getElementById("submitDaysButton")
  .addEventListener("click", function () {
    const selectedDays = [];
    selectedDaysArr = [];
    const checkboxes = document.querySelectorAll(
      '#weekDaysForm input[type="checkbox"]:checked'
    );

    checkboxes.forEach((checkbox) => {
      selectedDays.push({
        day: checkbox.name,
        date: checkbox.id,
      });

      selectedDaysArr.push({
        day: checkbox.name,
        date: formatDate(checkbox.id),
      });
    });

    if (selectedDays.length > 0) {
      document.getElementById("daysList").innerHTML = ""; // Clear previous list
      selectedDays.forEach((day) => {
        const li = document.createElement("li");
        li.textContent = `${day.day} (${day.date})`;
        document.getElementById("daysList").appendChild(li);
      });

      document.getElementById("selectedDays").classList.remove("hidden");

      // Store selected days in JSON format
      const selectedDaysJSON = JSON.stringify(selectedDays, null, 2);
      console.log("Selected Days JSON:", selectedDaysJSON);
      console.log(selectedDaysArr);
      downloadFile(selectedDaysArr);
    } else {
      alert("Please select at least one day.");
    }
  });

function formatDate(inpdate) {
  const dateObj = new Date(inpdate);
  const formattedDate = new Intl.DateTimeFormat("en-GB").format(dateObj);
  return formattedDate;
}

function downloadFile(filedata) {
  const jsonData = JSON.stringify(filedata, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "output.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function saveFile(data) {
  try {
    // Request permission to save a file
    const handle = await window.showSaveFilePicker({
      suggestedName: "output.json",
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    // Create a writable stream
    const writable = await handle.createWritable();

    // Write data to the file (convert object to JSON)
    await writable.write(JSON.stringify(data, null, 2));

    // Close the writable stream
    await writable.close();

    console.log("File saved successfully");
  } catch (err) {
    console.error("File save was cancelled or failed:", err);
  }
}
