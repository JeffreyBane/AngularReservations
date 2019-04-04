import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'

// Reservation class

export class Reservation {
    public date: string;
    public time: string;
    public name: string;
    public numberOfPeople: number; 
    public isFulfilled: boolean;
    public isCanceled: boolean;

    constructor(
        date: string,
        time: string,
        name: string,
        numberOfPeople: number
    ) {

    this.date = date;
    this.time = time;
    this.name = name;
    this.numberOfPeople = numberOfPeople;
    this.isFulfilled = false;
    this.isCanceled = false;
    }
    
}
    
    
@Component({
  selector: 'app-list-reservations',
  templateUrl: './list-reservations.component.html',
  styleUrls: ['./list-reservations.component.css', '../../css/bootstrap.min.css', '../../css/override.css']
})
export class ListReservationsComponent implements OnInit {

// Array to store reservation objects
Reservations: Array<Reservation> = [];
// Array to store valid reservation times
Times: string[] = this.buildTimes();


form: FormGroup; 
constructor(fb: FormBuilder) { 

    this.form = fb.group({
        "resName":["", Validators.required], 
        "resDate":["", Validators.required],
        "resNumber":["", Validators.required],
        "resTime":["", Validators.required]
    });


    // Check for first time run 
    if (localStorage.getItem("ReslistArray") === null) {
      // Add a few reservations for demo, comment out for production use
      // localStorage.clear();      

        this.Reservations = [
            new Reservation("12/3/2018", "5:00 PM", "Jones", 2),
            new Reservation("12/3/2018", "6:30 PM", "Smith", 4),
            new Reservation("12/3/2018", "9:00 PM", "Nakamoto", 1),
            new Reservation("12/4/2018", "4:00 PM", "The McSnootys", 2)
        ];
          
        // Store reservations array in LS  
        localStorage.setItem("ReslistArray", JSON.stringify(this.Reservations));
    }
    else
    {
        // Records exist in LS, grab them and stick them in the array
        var storedReservations = localStorage.getItem("ReslistArray");
        this.Reservations = JSON.parse(storedReservations);
    }
}
  

    
    onSubmit() {

        // Reservation added, grab form values
        var resDate: Date = new Date(this.form.get('resDate').value);
        var resTime: string = this.form.get('resTime').value;
        var resName: string = this.form.get('resName').value;
        var resNumber: number = this.form.get('resNumber').value;

        // Fix the timezone on the HTML 5 date control
        var formattedDate: string = (resDate.toLocaleDateString('en-US', {timeZone: 'UTC'}));

        // Add new reservation to the array
        this.Reservations.push(new Reservation(formattedDate, resTime, resName, resNumber));
          
        // Reservation added - Store updated array in LS then clear the form
        localStorage.setItem("ReslistArray", JSON.stringify(this.Reservations));
        this.form.reset();

    }
      
    statusChange(type: string, res: Reservation)
    {
        // change status based on which checkbox was clicked.
        if (type == "F"){
         res.isFulfilled = !res.isFulfilled;
        }
        else if (type == "C")
        {
          res.isCanceled = !res.isCanceled;
          // Could easily remove record from array here if requirement is hard delete on canceled records.
        }
    // Status changed - Store reservations in LS 
    localStorage.setItem("ReslistArray", JSON.stringify(this.Reservations));
    }
      
    
    // Make array for time Dropdown
    buildTimes () {
        // Loop and build a list of valid times for every 15 minutes
        var times: string[] = [];
        var suffix: string[];
        var hour: string[];
        var minute: string[];
        
        suffix = ["AM", "PM"];
        hour = ["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
        minute = ["00", "15", "30", "45"];
        
        for (let s of suffix) {
            for (let h of hour) {
               for (let m of minute) {
                times.push(h + ":" + m + " " + s);
                }
            }
        }
        return times;
    }
    

   
    ngOnInit() {
    }

}
