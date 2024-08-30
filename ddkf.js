User 
Story 
ID
User Story Pre-requisites Acceptance Criteria Security Acceptance 
Criteria
POCE2E0002-
001
As an (Maker, Authorizer) User I should be 
able to view the entitled Dashboards which 
should be loaded by default
There should be transactions initiated 
by users who are part of the of the 
same CIF to which the User belongs
User should have the widget allocated
User should have been entitled to the 
transaction
Once the user loges into the BOX
Dashboards should be the landing page
The Dashboards should be entitlement based (if there is no 
entitlement) then it should contain message to the user "Contact your 
administrator to get your widgets defined"
The Recent Transaction Widget 1 should be displayed for both 
Makers and Authorizers
The real time recent data (current week) should be listed based 
on the product and user role entitlement
Should be Sorted based on the Status (Processed by 
Bank, Rejected by Bank, Pending Authorization, Sent to 
Bank, Ready for Verification, Parsing Failed, Conversion 
Failed) 
 Sub Product Type - Date of Initiation - Currency 
Amount- Transaction Status
Ex: Telegraphic Transfer - 21-JUN-2024 - USD 
200.00 - Processed by Bank
On click it should display the selected data in a 
Transaction Summary View, refer OP1-FU-2POC-E2EViews for the Fields
If no data is available then empty widget should be loaded with 
widget title 
The Transaction For Your Approval Widget 2 should be displayed 
only for Authorizers 
The real time recent data (All time) should be listed based on 
the product and user role entitlement
Sub Product Type - Cumulative Count (Unitary) - 
Cumulative Count (Files) - Grand Total in (AED)
ex. Telegraphic Transfer - 5 - 3 - AED 50.6M
On click it should display the selected data in a 
Transaction Summary view, refer for the Fields
If no data is available then empty widget should be loaded with 
widget title
On click of any of the values it should display the selected data in a 
Pending Authorization view, refer OP1-FU-2POC-E2E-Views for the 
Fields
Login controls should 
be followed as per 
mentioned in POCE2E-0001.
Role based Access 
controls(RABC) for 
Dashboard
Audit logs and 
Monitoring should be 
enabled.
Give below are just sample source data, widget and tables for reference, the esthetics to be worked by the design and technical team
