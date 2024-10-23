
function testGS(){


    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec"

    fetch(url)
        .then(d => d.json())
        .then(d => {
            document.getElementById("app").textContent = d[0].status;
        });

}


document.getElementById("btn").addEventListener("click", testGS);
 



function addGS() {
    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec";
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Account: "TestAccount",
            BookingID: "TestBooking",
            AmenityName: "testAmenityName",
            BookingDate: "testBookingDate",
            TimeSlot: "testTimeSlot",
            ServiceRequestNumber: "testServiceRequestNumber",
            Status: "testStatus"
        })
    })
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        console.log("Success:", data);
        if (data.status === 200) {
            alert("Data added successfully");
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}




document.getElementById("btn2").addEventListener("click", addGS);
 
