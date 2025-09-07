function callEmergency(){
    window.location.href = "tel:112";
}

fetch("data.json")
  .then(res => res.json())
  .then(data => {

    window.showEmergency = function (id) {
      const emergency = data.emergencies.find(e => e.id === id);

      if (emergency) {
    
        document.getElementById("treatment-title").textContent = emergency.icon + " " + emergency.name;

        const list = document.getElementById("treatment-list");
        list.innerHTML = "";

        
        emergency.treatment.forEach(step => {
          const li = document.createElement("li");
          li.textContent = step;
          list.appendChild(li);
        });
      }
    };
  })
  .catch(err => console.error("Error loading JSON:", err));