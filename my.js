
function testGS(){


    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec"

    fetch(url)
        .then(d => d.json())
        .then(d => {
            document.getElementById("app").textContent = d[0].status;
        });

}


document.getElementById("btn").addEventListener("click", testGS);
 