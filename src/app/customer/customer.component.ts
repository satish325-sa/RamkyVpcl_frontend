import { CommonModule } from '@angular/common';
import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import {  FormsModule,NgModel} from '@angular/forms';
import { CustomerService } from './customer.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import * as XLSX from 'xlsx'; // Importing xlsx library
declare var $: any;  // Declare jQuery y





@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements AfterViewInit  {
  modeOfSupply: string = '0'; // Default value
  isTankDisabled: boolean = false; // Initially enabled
  
  
  effluentType: string = '0'; // Default value
  selectedTank: string = ''; // Selected tank number
  tankCapacity: string = ''; // Tank capacity to display
  tankDetails: any[] = []; // Array to hold tank details
  quantity: number | null = null;
  

  phValue: number | null = null;
  conveyanceDate: Date | null = null;
  minDate: string = '';
  maxDate: string = '';
  isSubmitting: boolean = false;

 
  Submitted= false;  
  ticketDetails: any={};
  customerName: string = '';
  customerId: string = '';
  txnid: string = '';
  selectedTicket: any = null;
  isManifestModalVisible: boolean = false;
  ticketno: string = '';

  @ViewChild('modeOfSupplyField') modeOfSupplyField: NgModel | undefined;
  @ViewChild('effluentTypeField') effluentTypeField: NgModel | undefined;
  @ViewChild('selectedTankField') selectedTankField: NgModel | undefined;
  @ViewChild('quantityField') quantityField: NgModel | undefined;
  @ViewChild('phValueField') phValueField: NgModel | undefined;
  statusdate: any;
  manifest: any;
  manifestqty: any;

  ngOnInit(): void {
    this.getTicketDetails();  // Call the method to fetch data on component init
    this.loadCustomerData();
  }

  loadCustomerData() {
    // Get the customer data from the service
    const customerData = this.customerservice.getCustomerData();
    
    if (customerData) {
      this.customerName = customerData.customerName;
      this.customerId = customerData.customerId;
      this.txnid=customerData.txnid;
    } else {
      console.error('Customer data not found');
    }
  }

  onModeOfSupplyChange(mode: string): void {
    this.isTankDisabled = mode === '2'; // Disable for "Tankers" (value 2)
    if (this.isTankDisabled) {
      this.tankCapacity = ''; // Reset tank capacity if disabled
      this.selectedTank = '';
    }
  }

  onEffluentTypeChange() {
    if (this.effluentType === '1' || this.effluentType === '2') {
      // Prepare the data to send to the API
      const data = {
        CLIENTID: "1062", 
        ZZEFFUENT_TYPE: this.effluentType
      };
  
      // Clear the tank details and reset values for tankNo and tankCapacity
      this.selectedTank = '';  // Clear the tank selection
      this.tankCapacity = '';   // Clear the tank capacity
      console.log('Cleared tankNo and tankCapacity on effluent type change');
  
      // Call the getTankDetails() method from the service
      this.customerservice.getTankDetails(data).subscribe(
        (response) => {
          console.log('Tank details:', response); // Handle the API response here
          this.tankDetails = response.responseData; // Store the tank details
          console.log("tankDetails", this.tankDetails);
        },
        (error) => {
          console.error('Error fetching tank details:', error); // Handle error here
        }
      );
    }
  }
  
   // Method to handle when a tank is selected
   onTankSelect(tankNo: any) {
    console.log('tankDetails',this.tankDetails)
    console.log('Selected tank number:', tankNo); // Log the selected tank number
    for(let i=0;i<this.tankDetails.length;i++){
      if(this.tankDetails[i].ZZTANKNO == tankNo){
        const selectedTank = this.tankDetails[i].ZZTANK_CAP
        this.tankCapacity=selectedTank
        console.log('selectedTank',selectedTank)

      }
    }
    // const selectedTank = this.tankDetails.filter(tank => tank.ZZTANKNO === tankNo);
    // console.log('Selected tank:', selectedTank);
   
}

  
  
  


 

  isNumberKey(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Allow numeric keys and prevent others
    return (charCode >= 48 && charCode <= 57); // 48 to 57 are the char codes for 0-9
  }
  
  
   
  constructor(private customerservice:CustomerService ,private router: Router,private dialog: MatDialog) {}
  ngAfterViewInit(): void {
    if (this.ticketDetails?.responseData?.data && this.ticketDetails.responseData.data.length > 0) {
      this.initializeDataTable();
    }
    
      // Set the default conveyance date to today
  const today = new Date();
  // Check if current time is 2 PM or later
  if (today.getHours() >= 14) {
    // If time is 2 PM or later, set conveyanceDate to tomorrow
    today.setDate(today.getDate() + 1); // Add 1 day to the current date
  }
  this.conveyanceDate = today.toISOString().split('T')[0] as unknown as Date; // Format as 'YYYY-MM-DD'
  this.getTicketDetails();
  
  
    // Calling the method to set min and max dates
  this.setDateRestrictions();
}


initializeDataTable(): void {
  $('#tblTimeSheet').DataTable({
    paging: true,
    pageLength: 10,
    searching: true,
    ordering: true, // Enable sorting
    info: true,
    language: {
      search: "Search: ",
      lengthMenu: "Show _MENU_ entries",
    }
  });
}
  

  // Method to set min and max date restrictions
  setDateRestrictions(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set tomorrow's date

    // Check if current time is after 2 PM
    const isAfter2PM = today.getHours() >= 14;

    // Set min and max dates
    if (isAfter2PM) {
      this.minDate = this.formatDate(tomorrow);  // Set min date to tomorrow if after 2 PM
      this.maxDate = this.formatDate(tomorrow);  // Max date also becomes tomorrow
    } else {
      this.minDate = this.formatDate(today);  // Min date is today if before 2 PM
      this.maxDate = this.formatDate(tomorrow);  // Max date is tomorrow
    }
  }
   // Utility function to format Date as yyyy-mm-dd
   private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

   // Method to block typing in the date input field
   blockTyping(event: KeyboardEvent): void {
    event.preventDefault(); // Prevent any key press inside the input
  }

   
   getTicketDetails(): void {
    const formattedCustomerId = this.customerId.toString().padStart(10, '0');
    console.log("formattedCustomerId",formattedCustomerId);
    const data = {
      "SELKUNNR": formattedCustomerId
    };
    console.log("data",data);
        
        this.customerservice.getTicketDetails(data).subscribe(
      (response) => {
        this.ticketDetails = response;
        console.log('Ticket details fetched successfully:', this.ticketDetails);
        this.initializeDataTable();
      },
      (error) => {
        console.error('Error fetching ticket details:', error);
        Swal.fire('Error', 'Failed to fetch ticket details. Please try again.', 'error');
      }
    );

        
  }

  clearForm(): void {
    const fields = [
      this.modeOfSupplyField,
      this.effluentTypeField,
      this.selectedTankField,
      this.quantityField,
      this.phValueField
    ];
    this.modeOfSupply = '0';
    this.isTankDisabled = false;
    
    this.effluentType = '0';
    this.selectedTank = '';
    this.tankCapacity = '';
    this.quantity = null;
    this.phValue = null;
    //this.conveyanceDate = null;
    this.Submitted = true;
    // Mark the form controls as untouched and pristine
    fields.forEach(field => {
      if (field) {
        field.control.markAsUntouched();
        field.control.markAsPristine();
      }
    });
  }

  // Effluent type mapping
  effluentTypeMapping: { [key: string]: string } = {
    '1': 'HTDS',
    '2': 'LTDS',
    '3': 'CHROMIUM',
    '4': 'CYNIDE',
    '5': 'SEWAGE'
  };

  validateForm(): boolean {
    if (this.modeOfSupply === '0' || this.effluentType === '0' || this.quantity === null || this.phValue === null || this.conveyanceDate === null) {
      //Swal.fire('Please fill all required fields.', 'Missing Fields', 'warning');
      return false;
    }
  
    if (this.quantity !== null && this.tankCapacity && this.quantity > parseFloat(this.tankCapacity)) {
      //Swal.fire('Invalid Quantity', 'Quantity should be less than or equal to the tank capacity.', 'error');
      return false;
    }
  
    if (this.phValue < 6.5 || this.phValue > 8.5) {
      //Swal.fire('Invalid pH Value', 'Please enter a valid pH value between 6.5 and 8.5.', 'error');
      return false;
    }
  
    if (this.modeOfSupply === '1' && (!this.selectedTank || !this.tankCapacity)) {
      //Swal.fire('Invalid Tank', 'Please select a valid Tank Number and Capacity.', 'error');
      return false;
    }
  
    return true;
  }

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
  // Utility function to format Date as DD-MM-YYYY
private formatDateToDDMMYYYY(date: string): string {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, '0');  // Ensure two digits for day
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');  // Ensure two digits for month (months are zero-indexed)
  const year = parsedDate.getFullYear();
  
  return `${day}-${month}-${year}`;
}

  

// Method to export data to Excel
exportToExcel() {
  // Extract the data from the response
  const data = this.ticketDetails?.responseData?.data || [];

  // Prepare the column headers
  const headers = [
    'S.No', 
    'Ticket', 
    'Mode of Supply', 
    'Effluent Type', 
    'Manifest', 
    'Manifest Quantity', 
    'Conveyance Requested Date', 
    'Created Date', 
    'Tank No', 
    'Tank Capacity', 
    'Received Quantity', 
    'CpH', 
    'TpH', 
    'Status Date', 
    'Status', 
    'Action'
   
  ];

  // Prepare the rows of data
  const rows = data.map((ticket:any, index:number) => {
    return [
      index + 1,  // S.No
      ticket?.ZZTICKETNO,  // Ticket
      ticket?.ZZMODE_SUPPLY,  // Mode of Supply
      ticket?.ZZEFFUENT_TYPE,  // Effluent Type
      ticket?.ZZMANIFEST,  // Manifest
      ticket?.ZZMANIFEST_QTY,  // Manifest Quantity
      this.formatDateToDDMMYYYY(ticket?.ZZCNVDAT),  // Conveyance Requested Date (formatted)
      this.formatDateToDDMMYYYY(ticket?.ZZCNVDAT),  // Created Date
      ticket?.ZZTANKNO,  // Tank No
      ticket?.ZZTANK_CAP,  // Tank Capacity
      ticket?.ZZQTY_RECVED,  // Received Quantity
      ticket?.ZZPH,  // CpH
      ticket?.ZZAPH,  // TpH
      this.formatDateToDDMMYYYY(ticket?.ZZSTATUS_DATE),  // Status Date
      ticket?.ZZACEPT,  // Status
      ticket?.ZZACTION  // Action
    ];
  });

    // Combine headers and rows into a single array
    const excelData = [headers, ...rows];

    // Convert the data into a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets');

    // Export the Excel file with a filename
    XLSX.writeFile(wb, 'ticket_details.xlsx');
  }

  generateTicketNumber(): string {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0].replace(/-/g, '');  // Format as YYYYMMDD
    let ticketNumber = localStorage.getItem('ticketNumber');
    
    // If no ticket number is stored, initialize it with the base value
    if (!ticketNumber) {
      ticketNumber = `${dateString}1000`;  // Starting number for the day
      localStorage.setItem('ticketNumber', ticketNumber);  // Store the first ticket number
    } else {
      // Increment the ticket number
      let incrementedTicket = parseInt(ticketNumber, 10) + 1;
      ticketNumber = incrementedTicket.toString();  // Update ticket number
      localStorage.setItem('ticketNumber', ticketNumber);  // Store the updated ticket number
    }
  
    return ticketNumber;
  }

  openManifestModal(ticket: any) {
    this.selectedTicket = { ...ticket }; 
    this.ticketno=this.selectedTicket?.ZZTICKETNO  || ''; 
    this.statusdate=this.selectedTicket?.ZZCNVDAT  || ''; 
    this.manifest=this.selectedTicket?.ZZMANIFEST  || ''; 
    this.manifestqty=this.selectedTicket?.ZZMANIFEST_QTY  || '';
    console.log("ticket details",this.selectedTicket);
    this.isManifestModalVisible = true;
  }

  closeManifestModal() {
    this.isManifestModalVisible = false;
  }

  updateManifest() {
    // Create the body object with all necessary data
    const body = {
      ZZTICKETNO: this.ticketno,    // Ticket No
      ZZMANIFEST_QTY: this.manifestqty, // Manifest Quantity
      ZZMANIFEST: this.manifest                   // Manifest
    };

    // Use the service to update the manifest details
    this.customerservice.updateManifest(body).subscribe({
      next: (response) => {
        // Handle successful response (e.g., show a success message)
        console.log('Updated Ticket:', this.selectedTicket);
        this.closeManifestModal();  // Close the modal after update
      },
      error: (error) => {
        // Handle error (e.g., show an error message)
        console.error('Error updating ticket:', error);
      }
    });
  }
  

  onSubmit() {
    
     // Trigger validation for each field
     this.modeOfSupplyField?.control.markAsTouched();
     this.effluentTypeField?.control.markAsTouched();
     this.selectedTankField?.control.markAsTouched();
     this.quantityField?.control.markAsTouched();
     this.phValueField?.control.markAsTouched();
     //this.conveyanceDateField?.control.markAsTouched();
      // Format customerId to always have 10 digits with leading zeros
  const formattedCustomerId = this.customerId.toString().padStart(10, '0');
     if (this.validateForm()===true)
    {
      this.isSubmitting = true;
      const ticketNumber = this.generateTicketNumber();
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // This will give the date
    const requestBody = {
      
      
      MATNR: 'EFF. TREAT - HTDS', 
      SELKUNNR: formattedCustomerId, 
      ZZEFFUENT_TYPE: this.effluentTypeMapping[this.effluentType as string] || '',
      ZZMODE_SUPPLY: this.modeOfSupply === '1' ? 'PIPE LINE' : 'TANKERS',
      ZZFLOW_METER: '', 
      ZZINI_READING: '', 
      ZZFIN_READING: '', 
      ZZFROM_DATE:formattedDate, 
      ZZTO_DATE: formattedDate, 
      ZZBUDAT: '', 
      ZZAPPROVE_NUM: '', 
      ZZMANIFEST: '', 
      ZZQTY_RECVED: '',
      ZZTANKNO: '1',
      //ZZTANKNO: this.selectedTank,
      ZZTANK_CAP: '100',
      //ZZTANK_CAP: this.tankCapacity,
      ZZPH: this.phValue,
      ZZAPPROV: 'C', 
      ZZTICKETNO: ticketNumber, 
      ZZAPH: '',
      ZZAPQTY: '', 
      ZZCNVDAT: this.conveyanceDate,
      YZCUST: '',
      LOSMENGE: this.quantity, 
       
    };
  
    this.customerservice.createTicket(requestBody).pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe(
      (response) => {
        console.log('Response from API:', response);
        
        if (response.data) {
          Swal.fire('Success', 'Ticket created successfully.', 'success');
          this.clearForm();
          this.getTicketDetails();
        } else {
          Swal.fire('Error', 'An error creating the ticket. Please try again.', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'There was an error creating the ticket. Please try again.', 'error');
        console.error('Error creating ticket:', error);
      }
    );
    
  }
} 
  
}