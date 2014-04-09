// set up vars to use for dev purposes
var PatientStatements = {
  "PatientStatements": [
    {
      "ID": 1233444,
      "Statement": "Female presented to ED",
      "Entry": 0
    },
    {
      "ID": 1233444,
      "Statement": "Paracetamol 1g qds x 5/7",
      "Entry": 1
    },
    {
      "ID": 1233555,
      "Statement": "Male presented to ED",
      "Entry": 1
    }
  ]
} ; 


var DeptStatus = {    // NOTE that this has been changed from an object to an array in the client side version-- needs to be changed too
    "DepartmentStatus": {
        "ER": {
            "Name": "Emergency Department",
            "Sites": "2 EDs: 1 Trauma; 1 Medical",
            "Males": 134,
            "Females": 100,
            "Total": 234
        },
        "IP": {
            "Name": "In Patients",
            "Sites": "12 wards",
            "Males": 96,
            "Female": 49,
            "Total": 145
        },
        "OP": {
            "Name": "Out Patients",
            "Sites": "15 clinics",
            "Males": 332,
            "Female": 447,
            "Total": 779
        }
    }
};

var testPatients = {
  "Patients": [
    {
      "ID": 1233555,
      "Sex": "Male",
      "Age": 58,
      "Name": "John Mick Dobson",
      "Encounters": [
        {
          "Date Open": "2013 June 11th",
          "Type": "Inpatient Stay",
          "Date Closed": "2013 June 15th"
        },
        {
          "Date Open": "2014 June 11th",
          "Type": "Outpatient Visit",
          "Date Closed": ""
        }
      ],
      "Allergies": [
        {
          "Causative Agent": "Latex",
          "Date First Experienced": "2013 June 11th",
          "Descriptive Reaction": "Local Rash",
          "Probability of Recurrence": "High"
        },
        {
          "Causative Agent": "Gluten",
          "Date First Experienced": "2013 June 11th",
          "Descriptive Reaction": "Bloating",
          "Probability of Recurrence": "High"
        }
      ],
      "InvestigationsResults": [
        {
          "OrderID": 23456,
          "Investigation": "FBC- HB count",
          "Date": "2013 March 17",
          "Result": "13.5 mg/L"
        },
        {
          "OrderID": 23456,
          "Investigation": "U&E- K level",
          "Date": "2013 March 17",
          "Result": "5.5 mg/L"
        }
      ],
      "Diagnoses": [
        "Hypertension",
        "Angina"
      ],
      "Treatments": [
        {
          "DrugID": 23456,
          "Name": "Furosemide",
          "Dose": "20mg",
          "Frequency": "BD"
        },
        {
          "DrugID": 23877,
          "Name": "GTN spray",
          "Dose": "2 puffs",
          "Frequency": "PRN"
        }
      ],
      "Procedures": [
        {
          "Procedure": "Total Hip Replacement (R)",
          "Date of Procedure": "2011 June 11th"
        },
        {
          "Procedure": "Total Knee Replacement (R)",
          "Date of Procedure": "2012 June 11th"
        }
      ],
      "PlansActions": [
        {
          "Plan": "Home Visit to check Mobility",
          "Date for Action": "2011 June 11th",
          "Actioned Note": "Done- Good Mobility"
        },
        {
          "Plan": "Orthopaedic Checkup",
          "Date for Action": "2014 June 11th",
          "Actioned Note": ""
        }
      ]
    },
    {
      "ID": 1233444,
      "Sex": "Female",
      "Age": 54,
      "Name": "Jane M Dilly",
      "Diagnoses": [
        "Diverticulitis",
        "Appendicitis"
      ],
      "Treatments": [
        "Paracetamol",
        "Ibuprofen"
      ]
    }
  ]
};



var testPatients2 = {
    "Patients": [
        {
            "ID": 1233555,
            "Sex": "Male",
            "Age": 58,
            "Name": "John DobsonMMM",
            "Diagnoses": [
                "Hypertension",
                "Angina"
            ],
            "Treatments": [
                "Furosemide",
                "GTN Spray"
            ]
        },
        {
            "ID": 1233444,
            "Sex": "Female",
            "Age": 54,
            "Name": "Jane DillyM",
            "Diagnoses": [
                "Diverticulitis",
                "Appendicitis"
            ],
            "Treatments": [
                "Paracetamol",
                "Ibuprofen"
            ]
        }
    ]
};




module.exports = {





onSocketMessage: function(ewd) {
var wsMsg = ewd.webSocketMessage;
var type = wsMsg.type;
var params = wsMsg.params;
var sessid = ewd.session.$('ewd_sessid')._value;

if (type === 'sendHelloWorldX') { 
ewd.log('*** Incoming Web Socket message received: ' + JSON.stringify(params, null, 2), 1);
var savedMsg = new ewd.mumps.GlobalNode('%AMessage', []);
savedMsg._setDocument(wsMsg);
return {savedInto: '%AMessage'};
}

//if (type === 'getHelloWorldY') {
if (type === 'getPatientList') {
//ClinUiP3
//var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001','Patients']);
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
console.log("Setting up new M variable");
// note that you need a name for a global with '' .. a number.. 
// must have ewd.mumps.GlobalNode
// with [ and ' around it and end the number with ' and ]
//testHospital3._setDocument(PtNumbers);
console.log("trying to set JSON to M");

//#########this is where we set the json to the M database
//HospitalZ._setDocument(DeptStatus);
HospitalZ._setDocument(testPatients);

//HospitalZ._setDocument(PatientStatements);
// #### this is where we end setting that json to M database 
// show that we can get JSON out of the M DB

var Houtput = HospitalZ.Patients._getDocument();
//var Houtput = HospitalZ._getDocument();
console.log("JSON output from M to follow...");
var ListPatients = "{" + Houtput  + "}"; // set up new object

//ListPatients = + testPatients;
console.log("Patients:" + JSON.stringify(Houtput, null, 4));
console.log(JSON.stringify(testPatients, null, 4));
console.log(JSON.stringify(ListPatients, null, 4));


//helloworld
var savedMsg = new ewd.mumps.GlobalNode('%AMessage', []);
//return savedMsg._getDocument();
//return ListPatients;
return Houtput;
}



if (type === 'getPatientListFemales') {
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
console.log("Setting up new M variable");
console.log("trying to set JSON to M");

HospitalZ._setDocument(testPatients);
//HospitalZ._setDocument(PatientStatements);
// #### this is where we end setting that json to M database 
// show that we can get JSON out of the M DB
var Houtput = HospitalZ.Patients._getDocument();
return Houtput;
}


if (type === 'getPatientListMales') {
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
console.log("Setting up new M variable");
console.log("trying to set JSON to M");

HospitalZ._setDocument(testPatients);
//HospitalZ._setDocument(PatientStatements);
// #### this is where we end setting that json to M database 
// show that we can get JSON out of the M DB
var Houtput = HospitalZ.Patients._getDocument();
return Houtput;
}

if (type === 'getPatientStatements') {
//ClinUiP3
//var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001','Patients']);
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
//console.log("Setting up new M variable");
// note that you need a name for a global with '' .. a number.. 
// must have ewd.mumps.GlobalNode
// with [ and ' around it and end the number with ' and ]
//testHospital3._setDocument(PtNumbers);
//console.log("trying to set JSON to M");

//#########this is where we set the json to the M database
//HospitalZ._setDocument(DeptStatus);
//HospitalZ._setDocument(testPatients);

HospitalZ._setDocument(PatientStatements);
// #### this is where we end setting that json to M database 
// show that we can get JSON out of the M DB

var PSoutput = HospitalZ.PatientStatements._getDocument();
//var Houtput = HospitalZ._getDocument();
//console.log("JSON output from M to follow...");
//var ListPatients = "{" + Houtput  + "}"; // set up new object

//ListPatients = + testPatients;
console.log("PatientStatements:" + JSON.stringify(PSoutput, null, 4));
//console.log(JSON.stringify(testPatients, null, 4));
//console.log(JSON.stringify(ListPatients, null, 4));


//helloworld
//var savedMsg = new ewd.mumps.GlobalNode('%AMessage', []);
//return savedMsg._getDocument();
//return ListPatients;
return PSoutput;
}





if (type === 'add2PatientM') { 
ewd.log('**Incoming PatientMonEWD message: ' + JSON.stringify(params, null, 2), 1);
console.log('**Incoming PatientMMM message: ' + JSON.stringify(params, null, 2), 1);

var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001','Patient']);

var Hinput = HospitalZ._getDocument();
var patientY = params; 
Hinput.push(patientY);

HospitalZ._setDocument(Hinput);
//testPatients.Patients.push(patientY);
console.log(JSON.stringify(Hinput, null, 4));
console.log("+++++++€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€+++++++++++++++++++++++++++++++");
//var savedMsg = new ewd.mumps.GlobalNode('%AMessage', []);
//savedMsg._setDocument(wsMsg);
//return {savedInto: '%AMessage'};
return true;
}



if (type === 'addStatements2PatientEHR') { 
ewd.log('**Incoming StatementEWD message: ' + JSON.stringify(params, null, 2), 1);
console.log('**Incoming StatementM message: ' + JSON.stringify(params, null, 2), 1);

var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001','PatientStatements']);

var Sinput = HospitalZ._getDocument();
var ptstatements = params; 
Sinput.push(ptstatements);

HospitalZ._setDocument(Sinput);
//testPatients.Patients.push(patientY);
console.log(JSON.stringify(Hinput, null, 4));
console.log("+++++++&&&&&&&&&&&&&&&+++++++++++++++++++++++++++++++");
//var savedMsg = new ewd.mumps.GlobalNode('%AMessage', []);
//savedMsg._setDocument(wsMsg);
//return {savedInto: '%AMessage'};
return true;
}


//ewd.log('*** Incoming Web Socket message @@@received: ' + JSON.stringify(wsMsg, null, 2), 1);
} // end of onSocketMsg
}; // end of modules