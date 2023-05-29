/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */


var eventsMediator = {
    events: {},
    on: function (eventName, callbackfn) {
      this.events[eventName] = this.events[eventName]
        ? this.events[eventName]
        : [];
      this.events[eventName].push(callbackfn);
    },
    emit: function (eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function (callBackfn) {
          callBackfn(data);
        });
      }
    },
  };
  


model = {
    data: [
        {"name": "Slappy the frog", "record": [false, true, true, true, true, true, true, true, true, true, true, true]},
        {"name": "sl", "record": [true, true, true, true, true, true, true, true, true, true, true, true]},
        {"name": "frog", "record": [true, true, true, true, false, true, true, true, true, true, true, false]},
        {"name": "frog2", "record": [true, true, true, true, true, true, false, true, true, true, true, true]},
    ],

    getData: function () {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            this.saveData();
        } else {
            this.data = JSON.parse(localStorage.attendance)
        }
        return this.data;
    },

    saveData: function() {
        localStorage.attendance = JSON.stringify(this.data);
    },

    setAttendance: function (i, j, checked) {
        this.data[i]["record"][j] = checked;
        this.saveData()
    },
};




view = {

    clearRows: function() {
        document.getElementById("table-rows").innerHTML = "";
    },

    render: function () {
        
        this.clearRows();

        let parent = document.getElementById("table-rows")

        // get the rows data
        let data = model.getData();

        
        
        // a loop through the data to render the rows

        for (let i = 0; i < data.length; i++) {

            // create the actual row
            let row = document.createElement("tr");
            row.className = "student";

            // create the row name
            let name = document.createElement("td");
            name.className = "name-col";
            name.innerHTML = data[i]["name"];

            row.append(name);

            let checkcol;
            let checkbox;
            let missedDays = 0;
            // create the 12 checkboxes
            for (let j = 0; j < data[i]["record"].length; j++) {
                checkcol = document.createElement("td");
                checkcol.className = "attend-col";
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.onclick = function () { view.checkBoxChanged(i, j, this); };
                checkbox.checked = data[i]["record"][j]
                if (!data[i]["record"][j]) {
                    missedDays++;
                }
                checkcol.append(checkbox);
                row.append(checkcol);
            }
            let missed = document.createElement("td");
            missed.className = "missed-col";
            missed.innerHTML = missedDays;
            row.append(missed);
            parent.append(row);

        }
    },

    checkBoxChanged: function (i, j, checkbox) {
        eventsMediator.emit("checkbox.changed", [i, j, checkbox.checked]);
    },

};



controller = {
    init: function() {
        view.render();


        
        eventsMediator.on("checkbox.changed", function (data) {

            controller.changeValue(data[0], data[1], data[2]);

        });

    },
    changeValue: function(i, j, checked) {
        model.setAttendance(i, j, checked);
        view.render();
    }
}

controller.init();


