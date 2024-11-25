import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  FormsModule} from '@angular/forms';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  modeOfSupply: string = '0'; // Default value
  isTankDisabled: boolean = false; // Initially enabled
  tankNumbers: number[] = [1, 2, 3, 151, 152, 153]; // Tank No values
  filteredTankNumbers: number[] = []; // Filtered tank numbers to display
  effluentType: string = '0'; // Default value
  selectedTank: string = ''; // Selected tank number
  tankCapacity: string = ''; // Tank capacity to display
  quantity: number | null = null;

  phValue: number | null = null;
  conveyanceDate: Date | null = null;


  onModeOfSupplyChange(mode: string): void {
    this.isTankDisabled = mode === '2'; // Disable for "Tankers" (value 2)
    if (this.isTankDisabled) {
      this.tankCapacity = ''; // Reset tank capacity if disabled
      this.selectedTank = '';
    }
  }

  onTankNumberChange(tank: string): void {
    if (this.modeOfSupply === '1' && this.effluentType === '1') { // Pipeline & HTDS
      if (tank === '1' || tank === '2') {
        this.tankCapacity = '100';
      } else if (tank === '3') {
        this.tankCapacity = '304';
      } else {
        this.tankCapacity = ''; // Default if no match
      }
    } else if(this.modeOfSupply === '1' && this.effluentType === '2'){
      if (tank === '1' || tank === '3') {
        this.tankCapacity = '300';
      } else if (tank === '151' || tank === '152'|| tank === '153') {
        this.tankCapacity = '120';
      } else if(tank === '2') {
        this.tankCapacity = '204'; // Default if no match
      }else{
        this.tankCapacity = ''; // Default if no match
      }
    }
      
  }


  onEffluentTypeChange(type: string): void {
    if (type === '1') { // HTDS
      this.filteredTankNumbers = this.tankNumbers.filter(tank => [1, 2, 3].includes(tank));
    } else {
      this.filteredTankNumbers = [...this.tankNumbers]; // Show all tanks for other types
    }
    this.selectedTank = ''; // Reset selected tank when effluent type changes
    this.tankCapacity = ''; // Reset tank capacity
  }

  isNumberKey(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Allow numeric keys and prevent others
    return (charCode >= 48 && charCode <= 57); // 48 to 57 are the char codes for 0-9
  }
  
  
   
  constructor(private customerservice:CustomerService) {}
  ngOnInit(): void {
    this.filteredTankNumbers = [...this.tankNumbers]; // Initialize with all tanks
  }

  clearForm(): void {
    this.modeOfSupply = '0';
    this.isTankDisabled = false;
    this.filteredTankNumbers = [...this.tankNumbers]; // Reset filtered tank numbers
    this.effluentType = '0';
    this.selectedTank = '';
    this.tankCapacity = '';
    this.quantity = null;
    this.phValue = null;
    this.conveyanceDate = null;
  }

  // Effluent type mapping
  effluentTypeMapping: { [key: string]: string } = {
    '1': 'HTDS',
    '2': 'LTDS',
    '3': 'CHROMIUM',
    '4': 'CYNIDE',
    '5': 'SEWAGE'
  };
  

  
  onSubmit() {
    // Validate required fields
    if (
      this.modeOfSupply === '0' ||
      this.effluentType === '0' ||
      this.quantity === null ||
      this.phValue === null ||
      this.conveyanceDate === null
    ) {
      alert('Please fill all required fields.');
      return;
    }
  
    // Validate PH value between 6.5 and 8.5
    if (this.phValue < 6.5 || this.phValue > 8.5) {
      alert('Please enter a valid pH value between 6.5 and 8.5.');
      return;
    }
  
    // Validate quantity should be less than or equal to tank capacity
    if (this.quantity !== null && this.tankCapacity && this.quantity > parseFloat(this.tankCapacity)) {
      alert('Quantity should be less than or equal to the tank capacity.');
      return;
    }
  
    // Additional validation for Mode of Supply: Pipeline
    if (this.modeOfSupply === '1') {
      if (!this.selectedTank) {
        alert('Please select a valid Tank Number.');
        return;
      }
      if (!this.tankCapacity) {
        alert('Please select a valid Tank Capacity.');
        return;
      }
    }
   

     
  
    const requestBody = {
      MATNR: '', // Add Material Number if applicable
      SELKUNNR: '', // Customer Number
      ZZEFFUENT_TYPE: this.effluentTypeMapping[this.effluentType as string] || '', 
      ZZMODE_SUPPLY: this.modeOfSupply === '1' ? 'Pipeline' : 'Tankers',
      ZZFLOW_METER: '', // Add Flowmeter if applicable
      ZZINI_READING: '', // Add Initial Reading if applicable
      ZZFIN_READING: '', // Add Final Reading if applicable
      ZZFROM_DATE: '', // Add From Date if applicable
      ZZTO_DATE: '', // Add To Date if applicable
      ZZBUDAT: '', // Add Date if applicable
      ZZAPPROVE_NUM: '', // Add Approval No if applicable
      ZZMANIFEST: '', // Add Manifest Number if applicable
      ZZQTY_RECVED: '',
      ZZTANKNO: this.selectedTank,
      ZZTANK_CAP: this.tankCapacity,
      ZZPH: this.phValue,
      ZZAPPROV: '', // Add Approval Status if applicable
      ZZTICKETNO: '', // Add Ticket No if applicable
      ZZAPH: '', // Add TPH if applicable
      ZZAPQTY: '', // Add Approved Qty if applicable
      ZZCNVDAT: this.conveyanceDate, // Use formatted conveyance date
      YZCUST: '',
      LOSMENGE: '', // Add Inspection Lot Quantity if applicable
    };
  
    this.customerservice.createTicket(requestBody).subscribe(
      (response) => {
        console.log('Ticket created successfully:', response);
        this.clearForm(); // Clear all form fields after successful submission
      },
      (error) => {
        console.error('Error creating ticket:', error);
        //this.clearForm(); // Clear all form fields after successful submission
      }
    );
  }
}