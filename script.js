// Get the current date and calculate the previous week's dates (Monday to Friday)
const today = new Date();
var selectedDaysArr = [];
var selectedDateRange = "";
var flatpickrInstance;

// Event Listeners for Yes and No buttons
document.getElementById("yesButton").addEventListener("click", function () {
  $(".card").addClass("hidden");
  $(".date-picker-container").removeClass("hidden");
  frameCalender();
});

document.getElementById("noButton").addEventListener("click", function () {
  alert("Thank you for confirming!");
  window.close();
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

function frameCalender() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    .toISOString()
    .split("T")[0];

  flatpickrInstance = flatpickr("#daterange", {
    mode: "multiple", // Enables date range selection
    dateFormat: "Y-m-d",
    disable: [
      (date) => date.getDay() === 0 || date.getDay() === 6, // Disable weekends
    ],
    minDate: firstDayOfMonth, // Set min date to the first day of the current month
    onChange: function (selectedDates, dateStr, instance) {
      selectedDateRange = dateStr; // Store the selected date range
      selectedDaysArr = [];
      selectedDaysArr = selectedDates.map((date) => {
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        const formattedDate = date.toLocaleDateString("en-US");
        return { day: day, date: formattedDate };
      });
    },
    // Automatically open the calendar
    inline: true, // Show calendar inline
    allowInput: false, // Prevent manual input
  });
}

// Function to show the modal
function showModal() {
  if (!selectedDateRange) {
    DevExpress.ui.notify(
      `Please select a dates before submitting.`,
      "error",
      3000
    );
    return false;
  }
  $(".flatpickr-prev-month").addClass("hidden")
  $(".flatpickr-next-month").addClass("hidden")

  // Display the selected dates in the modal
  let datesDisplay = selectedDaysArr
    .map((item) => `${item.day}: ${item.date}`)
    .join("<br>");
  document.getElementById(
    "selectedDatesDisplay"
  ).innerHTML = `You have selected:<br><strong>${datesDisplay}</strong>`;

  // Show the modal
  document.getElementById("confirmationModal").style.display = "flex";
  $("#confirmationModal").removeClass("hidden");
  return false; // Prevent the form from submitting
}

// Function to close the modal
function closeModal() {
  $(".flatpickr-prev-month").removeClass("hidden")
  $(".flatpickr-next-month").removeClass("hidden")
  document.getElementById("confirmationModal").style.display = "none";
}



// Function to submit the form after confirmation
function submitForm() {
  DevExpress.ui.notify(
    `The timesheet has been submitted successfully.`,
    "success",
    3000
  );
  closeModal();
  clearSelection();
}

// Function to clear the selection
function clearSelection() {
  selectedDates = []; // Reset the selected dates array
  document.getElementById("daterange").value = ""; // Clear the Flatpickr input
  flatpickrInstance.clear(); // Clear the Flatpickr selection but keep the calendar
}
