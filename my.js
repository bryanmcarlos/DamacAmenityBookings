
function testGS(){


    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec"

    fetch(url)
        .then(d => d.json())
        .then(d => {
            document.getElementById("app").textContent = d[0].status;
        });

}


document.getElementById("btn").addEventListener("click", testGS);
 



function addGS(){


    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec"

    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        //credentials: 'omit',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        // insert data
        body:   JSON.stringify({Account:"TestAccount", BookingID:"TestBooking", AmenityName:"testAmenityName", BookingDate:"testBookingDate", TimeSlot:"testTimeSlot", ServiceRequestNumber:"testServiceRequestNumber", Status:"testStatus"})
 
    });

}


document.getElementById("btn2").addEventListener("click", addGS);
 
