User 
Story 
ID
User 
Story
Prerequisites
Acceptance Criteria Security 
Acceptance 
Criteria 
POCE2E0006-
001
As a maker 
user, I should 
be able to do a 
file upload, to 
enable entry of 
number of 
records as 
need in single 
shot
Should 
have been 
entitled to 
use the 
sub 
product 
File Upload
Maker 
should be 
assigned 
with daily 
limit to 
determine 
if new 
transaction 
could be 
initiated 
Authorizatio
n matrix is 
designed 
to route to 
Authorizer 
based on 
the 
transaction 
limit set at 
the user 
level
Navigation: 
Payments>
File Upload
Templates 
are already 
defined in 
the system
Once I land in the File Upload screen
#Transaction Type should be auto fixed as File Upload
#Template Name mandatory single select drop down from list of values (ex: Payment File Upload)
#Template Detail button,
On click #Template Details popup (Display only no inputs)should open with below details in place
#Template Name
#Date (DD-MM-YYYY)
#File Type (excel with .xls extension)
#Field Separator (Not Applicable)
#Field Details section should contain a table as below
Field Name Data 
Type
Field 
Length
Mandatory Sequence Default 
value
Description
Customer 
Reference No
CHAR 35 Y 1 Not 
Applicable
Customer 
Reference 
Number, Any 
alphanumeric 
reference 
number to tag 
the uniqueness 
of the payments 
record. If this is 
repeated in 
future file 
uploads, the 
service will 
consider the 
payment as 
duplicate and 
will not accept 
the upload. /-_:().
+[SPACE] are 
the allowed 
special 
characters for 
DFT and TT
Transaction 
Currency
CHAR 3 Y 2 Not 
Applicable
Transaction 
Currency
Transaction 
Amount
CHAR 15 Y 3 Not 
Applicable
Transaction 
Amount
Transaction 
Type Code
CHAR 3 Y 4 Not 
Applicable
Product 
Code: Account 
to Account 
Transfer:
- BT Domestic 
Transfer :- 
LBT Cross 
Border Transfer :
- TT Customer 
Cheque :- CC
Beneficiary 
Name
CHAR 70 Y 5 Not 
Applicable
Beneficiary 
Name
37
1. 
c. 
i. 
5. 
a. 
1. 
2. 
3. 
a. 
b. 
c. 
d. 
4. 
5. 
Beneficiary 
Addr. Line 1
CHAR 255
Y
6 Not 
Applicable
Beneficiary 
Addr. Line 1. /-
_:().+[SPACE] 
are the allowed 
special 
characters for 
DFT and /-?:().
'[SPACE] are 
the allowed 
special 
characters for 
TT
Beneficiary 
Addr. Line 2
CHAR 35
Y
7 Not 
Applicable
Beneficiary 
Addr. Line 2. /-
_:().+[SPACE] 
are the allowed 
special 
characters for 
DFT and /-?:().
'[SPACE] are 
the allowed 
special 
characters for 
TT
Beneficiary 
Addr. Line 3
CHAR 35
N
8 Not 
Applicable
Beneficiary 
Addr. Line 3. /-
_:().+[SPACE] 
are the allowed 
special 
characters for 
DFT and /-?:().
'[SPACE] are 
the allowed 
special 
characters for 
TT
Beneficiary 
Country
CHAR 60
Y
9 Not 
Applicable
Beneficiary 
Country
Beneficiary Email Id
CHAR 255
N 10 Not 
Applicable
Beneficiary Email Id
Beneficiary 
Account No.
CHAR 34
Y 11 Not 
Applicable
Beneficiary 
Account No.
Beneficiary 
Bank Swift 
Code
CHAR 11
Y 12 Not 
Applicable
Valid Swift Code.
Intermediatory 
Bank Swift 
Code
CHAR 11
N 13 Not 
Applicable
Beneficiary 
Bank's 
Correspondent 
Bank Swift Code
Charge Type CHAR
3
Y 14 Not 
Applicable
Correspondent 
bank charges to 
be borne by. In 
this column 
please mention: 
OUR: If all 
charges are to 
be borne by you 
i.e.; 
CORRESPOND
ENT bank 
charges if any 
OR 
BEN: If all 
charges are to 
be borne by the 
beneficiary OR 
SHA: If charges 
are to be borne 
by you and 
correspondent 
bank charges by 
the beneficiary
Purpose Code CHAR 255
Y 15 Not 
Applicable
Purpose Code
Beneficiary 
Purpose Code
CHAR 10
N 16 Not 
Applicable
Beneficiary 
Purpose Code
Purpose Of 
Payment
CHAR 135
Y 17 Not 
Applicable
Purpose Of 
Payment / 
Secondary 
Information. /-
_:().+[SPACE] 
are the allowed 
special 
characters for 
DFT and /-:().+
[SPACE] are the 
allowed special 
characters for 
TT
Input 
sensitizati
on and 
Validation 
file 
content 
upload
Role Back 
Access 
controls 
for File 
upload 
and 
download 
functionalit
y.
Security 
controls 
File 
upload 
and 
download 
Functionali
ty
File
Ext
ens
ion 
Vali
dati
on
Co
nte
nt 
Typ
e 
Vali
dati
on 
File
Na
me 
Vali
dati
on 
Mal
war
e 
and
Vir
us 
sca
nni
ng 
for 
File
upl
oad.
Maker/ 
Checker 
control 
should be 
implement
ed 
Audit logs 
and 
Monitoring
should be 
enabled.
38
1. 
c. 
i. 
5. 
a. 
b. 
c. 
d. 
6. 
a. 
7. 
8. 
9. 
10. 
11. 
12. 
13. 
14. 
15. 
16. 
a. 
b. 
c. 
d. 
Routing Code CHAR 11 N 18 Not 
Applicable
Bank routing 
Code. Non 
mandatory if 
SWIFTCODE is 
selected. 
However, if 
Routing Code is 
selected then all 
Beneficiary 
Bank Name, 
Beneficiary 
Bank Address,
Beneficiary 
Bank Location,
Beneficiary 
Bank Country 
becomes 
mandatory.
Deal 
Reference No
CHAR 12 N 19 Not 
Applicable
Deal Reference 
No. If deal 
number is 
selected then, 
deal rate and 
deal date 
becomes 
mandatory.
Account 
Identifier
CHAR 1 N 20 Not 
Applicable
Account Identifier
#Download button, on click the .xls file should be downloaded with all field name in each columns from from A 
through T
The entire file cell content should be formatted in text.
#Close button, on click the popup should be closed and I should land back to the Bulk File Upload screen
#Add File button, on click explorer should open, and I should have an option to explore and choose the file to be 
uploaded
Allowed file format xls, txt, csv, xml.
User Should have an option to choose the #Debit Type should be defaulted to #Single that is Debit account should be 
posted a consolidated amount of all line items in the template file
User should have an option to select the required #Debit Account single select mandatory
Once user selects the debit account system should display (#Account Currency, #Country, #Account Nickname, 
#Account Name, #Account Type & #Available Account Balance)
The #Fixed Debit should be defaulted to #No that is based on the applied conversion the payment amount should be 
static as per the values in the template file (that is the values in the template file should be taken as payment amount)
#Value Date date picker current or future date should be allowed, past dates should be grayed and not allowed for 
selection
#Reference in your Statement - Free text, user entry
#View Correspondent Bank Charge - Link, on click (https://www.emiratesnbd.com/-/media/enbd/files/kfs
/ENBD_CB_SOC.pdf?_dinsess=ca478721-3cb2-4d1c-98ea-b3d09d7f29a6) should open in new window
#View Charges for Corporate - Link, on click ( https://www.emiratesnbd.com/-/media/enbd/files/kfs
/EmiratesNBD_BB_Schedule_of_charges.pdf?_dinsess=ca478721-3cb2-4d1c-98ea-b3d09d7f29a6 ) should open in 
new window
#View Charges for Business Banking - Link, on click (https://www.emiratesnbd.com/-/media/enbd/files/kfs
/EmiratesNBD_BB_Schedule_of_charges.pdf?_dinsess=ca478721-3cb2-4d1c-98ea-b3d09d7f29a6) should open in 
new window
#View Disclaimer text - Link, on click following bilingual text should open in new window (This text should be 
maintained through a UI in backend)
English - EN
Kindly ensure accurate and valid beneficiary details are updated before initiating a transfer or else your transfer 
will be rejected, and funds credited back in 3 to 5 working days based on confirmation from beneficiary bank. 
Please note such refunds will be subject to conversion at prevailing exchange rates and loss incurred, if any 
shall be borne by the originator.
The actual time to complete a transaction may differ from estimates due to increased scrutiny of transactions by 
the correspondent bank/financial institution or entity providing financial services to the beneficiary of remittances 
Amount may be subject to additional cost
i. OUR - Bank Charges and additional Correspondent Bank Charges will be debited from the originating account
ii. BEN - Bank charges will be deducted from transaction amount and proceeds will be sent to the Beneficiary
iii. SHA - Bank Charges will be debited from originating account and Correspondent Bank Charges will be 
deducted from the proceeds by correspondent bank,if applicable
Penalties and Fees may be applied if there is a client error or omission in providing correct or incomplete 
information for remittances.
* Exchange rate displayed on transfer pages are indicative. Prevailing rates will be applied at the time of 
processing.
* Additional fees may be levied by the correspondent bank/financial institution or entity providing financial 
services to the beneficiary of remittances.
* There is no cooling-off period for the FX transaction as it requires immediate processing.
* For local currency payments, correspondent charges equivalent to AED 1.05/- (incl.VAT) will be applicable.
Cancellation Process :
Ensure accuracy of details provided prior to submitting the transfer request. To cancel or recall any transfer 
sent, contact the Emirates NBD call center/branch for submitting the request within 24 hours. The processing of 
such request is subject to refund/reversal confirmation from beneficiary or correspondent bank. Exchange loss 
amount, if any, shall be levied in such cases.
Arabic-AR
 3 5 . .
 / 
 .
 OUR: .
 BEN: .
 SHA: .
 .
 .
 / .
 .
 1.05 ( VAT).
 :
 . 24 . . .
39
1. 
c. 
i. 
17. 
a. 
b. 
c. 
i. 
ii. 
iii. 
1. 
a. 
2. 
a. 
iv. 
v. 
vi. 
1. 1. 
a. 
1. 
2. 
1. 
2. 
1. 
2. 
3. 
4. 
1. 
2. 
3. 
Once the mandatory fields are entered, user should have an option #View - button
On click File Upload Review screen should open with all entered details
#User Comments - Field - Free text open for user entry
#Submit - button - on click #Confirmation popup should open with 
#Transaction Reference Number - Display only -Auto generated
#Date/Time - Display one - Time stamp (11-JUN-2024 09:21:04) at which the #Submit button was 
clicked
#Status - Display only -
If all validation are through then
Ready for Verification and should be set and send to #Tranasction Summary view
If any validation is failed then
Appropriate status and should be set and send to #Transaction Summary view
Transaction Type - Display only - File Upload
#Success Message - Display only - File Upload has been uploaded successfully.
#Close - Button - on click #Confirmation popup to close
POCE2E0006-
002
As a system, I 
should be able 
to do the 
following 
validation on 
file upload
User 
should 
have 
uploaded 
the file and 
Maker user 
should 
have click 
the #Submit
button
As a system I should have a capability to check and through error message, set status and the Transaction Summary view to the as 
follows:
Validation 
Type
Validation Status Error Message
Validation 
Type
Success Failure
Conversion Template Format and File format 
Check 
Pending 
Parsing
Conversion 
Failed
File format mismatch
Parsing 
Validation
Mandatory Field Check Pending 
Business 
Validation
Parsing 
Failed
Missing Mandatory Fields "<Row Number || 
Missing Column Names>"
Business 
Validation
BIC Code Validation Ready for 
Verification
Verification 
Failure
Invalid BIC Code <Row Number || Erroneous 
Column Value
Business 
Validation
Entitlement Check (Account and 
Workflow)
Ready for 
Verification
Verification 
Failure
CBX entitlement validation failed <Row Number || 
Erroneous Column Value
Business 
Validation
Purpose Code--Validation Ready for 
Verification
Verification 
Failure
Invalid Purpose Code <Row Number || Erroneous 
Column Value
Business 
Validation
Customer Reference Ready for 
Verification
Verification 
Failure
Customer reference validation failed <Row 
Number || Erroneous Column Value
Business 
Validation
Beneficiary name or Beneficiary Nick 
name required
Ready for 
Verification
Verification 
Failure
Invalid Beneficiary name or Beneficiary nick 
name <Row Number || Erroneous Column Value
Business 
Validation
Charge Type Validation, it should 
accept only (OUR, BEN or SHA)
Ready for 
Verification
Verification 
Failure
Invalid Charge Type <Row Number || Erroneous 
Column Value
Business 
Validation
Iban Validation (Country based length 
validation should be in place
Ready for 
Verification
Verification 
Failure
Invalid IBAN <Row Number || Erroneous Column 
Value
Maker/ 
Checker 
control 
should be 
implement
ed.
Audit logs 
and 
Monitoring
should be 
enabled.
POCE2E0006-
003
As a 
authorizer 
user user, I 
want to be 
able to 
authorize File 
Upload 
transaction
 User is 
entitled to 
Authorizer 
the 
transaction
Transaction
should 
land for 
approval 
only for the 
respective 
authorizer 
based on 
the 
transaction 
limit set
The user should be able to view the list of transactions pending to be authorized via (Pending Authorization queue) based on their 
Transaction and Limits set
While approving, the user should be able to view all the details of the transactions input at the time of making.
Once approved, the user should be taken to the 2FA journey .
Based on successful 2 factor authentication, the transactions must be successfully approved and sent to downstream system and status 
should be set as Sent to Bank
User autho
rization 
should be 
intact with 
Entitlemen
t controls 
should 
implement
ed
Second 
Factor 
Authentica
tion for 
approval 
actions
Audit logs 
and 
Monitoring
should be 
enabled
