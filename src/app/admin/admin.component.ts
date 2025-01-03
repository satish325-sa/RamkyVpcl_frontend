import { Component, OnInit } from '@angular/core';
import { RouterModule ,Router} from '@angular/router';
import Swal from 'sweetalert2';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../customer/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule,RouterModule,CommonModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  customerName: string = '';
  customerId: string = '';
  ticketDetails: any={};
  customerDetails: any[] = []; // Array to store the fetched customer details
  selectedCustomer:string='';
  status: string = '0'; // Default status (0 = "Select")
  fromDate: Date = new Date();
toDate: Date = new Date();

  filteredTickets: any={};
  tableData: any[] = [];
  isFormVisible: boolean = false;
  selectedTicket: any = null; // Store selected ticket data
  ticketNo:any=null;
  updatestatus: string = '';  // to capture the selected status
tph: number = 0;      // to capture the TpH value
approveQty: number = 0;
  

  logout() {
    
    Swal.fire({
      title: 'Are you sure to logout?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  openPasswordChangeDialog() {
    this.dialog.open(PasswordChangeComponent, {
      width: '400px',  // Customize dialog width as needed
      data: {}  // Pass data to the dialog if necessary
    });
  }

  constructor(private customerservice:CustomerService,private router: Router,private dialog: MatDialog) {}
ngOnInit(): void {
  this.loadCustomerData();
  this.getAllTicketDetails();
  this.getCustomerDetails();
}
loadCustomerData() {
  // Get the customer data from the service
  const customerData = this.customerservice.getCustomerData();
  
  if (customerData) {
    this.customerName = customerData.customerName;
    this.customerId = customerData.customerId;
  } else {
    console.error('Customer data not found');
  }
}
getAllTicketDetails(): void {
        this.customerservice.getAllTicketDetails().subscribe(
      (response) => {
        this.ticketDetails = response;
        this.tableData = response.responseData?.data || []; 
        console.log('Ticket details fetched successfully:', this.ticketDetails);
        console.log("tableData:",this.tableData);
        //this.initializeDataTable();
      },
      (error) => {
        console.error('Error fetching ticket details:', error);
        Swal.fire('Error', 'Failed to fetch ticket details. Please try again.', 'error');
      }
    ); 
  }


  // Method to fetch customer details
  getCustomerDetails(): void {
    this.customerservice.CustomerDetails().subscribe(
      (response) => {
        this.customerDetails = response.responseData; // Assuming the data you need is in response.responseData
        console.log('Customer details fetched successfully:', this.customerDetails);
      },
      (error) => {
        console.error('Error fetching customer details:', error);
        Swal.fire('Error', 'Failed to fetch customer details. Please try again.', 'error');
      }
    );
  }

  // Define the onCustomerSelect method here
  onCustomerSelect(selectedCustomer: any): void {
    console.log('Selected customer:', selectedCustomer);
    // Perform any further logic needed when a customer is selected
  }

  // Method to call the filtered tickets API
  filterTickets(): void {
    // Function to format a Date object to "YYYYMMDD"
    const formatDate = (date: Date): string => {
        // Ensure the date is valid
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so we add 1
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`; // Returns date in "YYYYMMDD" format
    };

    // Ensure fromDate and toDate are Date objects
    let fromDate: Date;
    let toDate: Date;

    // If fromDate or toDate is a string, convert them to Date objects
    if (typeof this.fromDate === 'string') {
        fromDate = new Date(this.fromDate);
    } else {
        fromDate = this.fromDate;
    }

    if (typeof this.toDate === 'string') {
        toDate = new Date(this.toDate);
    } else {
        toDate = this.toDate;
    }

    // Validate that the dates are valid Date objects
    if (!(fromDate instanceof Date) || isNaN(fromDate.getTime())) {
        Swal.fire('Error', 'Invalid fromDate', 'error');
        return;
    }

    if (!(toDate instanceof Date) || isNaN(toDate.getTime())) {
        Swal.fire('Error', 'Invalid toDate', 'error');
        return;
    }

    const filterData = {
        USERNAME: this.selectedCustomer.toUpperCase(),
        ZZAPPROV: this.status,
        ZZCNVDAT: formatDate(fromDate), // Format the fromDate
        ZZCNVDAT1 : formatDate(toDate) // Format the toDate
    };
    console.log("filtered request",filterData)
    // Send the filterData object to the service
    this.customerservice
        .getFilteredTickets(filterData)
        .subscribe(
            (response) => {
              console.log("response:", response);
              this.filteredTickets = response.responseData|| [];
                this.tableData = this.filteredTickets; 
                console.log('tabledata2:', this.tableData);
            },
            (error) => {
                console.error('Error fetching filtered tickets:', error);
                Swal.fire('Error', 'Failed to fetch filtered tickets. Please try again.', 'error');
            }
        );
}
 // Method to check if ZZCNVDAT is the same as today's date
 isDateSame(ticketDate: string): boolean {
  const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US'); // Get current system date
  const ticketDateFormatted = formatDate(ticketDate, 'yyyy-MM-dd', 'en-US'); // Format ticket's ZZCNVDAT date
  
  return currentDate === ticketDateFormatted; // Compare both dates
}

toggleForm(ticket: any) {
  this.selectedTicket = { ...ticket }; // Make a copy of the selected ticket
  this.ticketNo = this.selectedTicket.ZZTICKETNO; // Extract the ticket number
  this.isFormVisible = !this.isFormVisible; // Toggle the form visibility
}


closeForm() {
  this.isFormVisible = false; // Close the form without updating
  this.selectedTicket = null; // Reset selected ticket
}

 // Handle form submission for updating ticket
 updateTicket() {
  if (this.ticketNo) {
    console.log("Selected TicketNo:", this.ticketNo);
    console.log("Status:", this.status);
    console.log("TpH:", this.tph);
    console.log("Approve Qty:", this.approveQty);

    // Prepare the data to send to the service
    const updateData = {
      ZZTICKETNO: this.ticketNo,
      ZZAPPROV: this.updatestatus,
      ZZAPH: this.tph,
      ZZAPQTY: this.approveQty
    };

    // Call the service to update the ticket in SAP
    this.customerservice.updateTicket(updateData).subscribe(
      response => {
        console.log('Ticket updated successfully', response);
        // Close the form after successful update
        this.closeForm();
        // Optionally, refresh the table data or show a success message
      },
      error => {
        console.error('Error updating ticket', error);
      }
    );
  }
}
  


}
