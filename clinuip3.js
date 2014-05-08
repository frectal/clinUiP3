// set up vars to use for dev purposes

// these json docs are the basis for the data .. get stored in the M database and then the JSON document grows in the M database
// ie you will see the start of the JSON documents here but the rest of it is stored in the M database
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


var testPatients = {
  "Patients": [
    {
      "ID": 1233555,
      "Sex": "Male",
      "Age": 58,
      "Name": "John Micky Dobson"
	  
    },
    {
      "ID": 1233444,
      "Sex": "Female",
      "Age": 54,
      "Name": "Jane M Dilly"
	  
    }
  ]
};




module.exports = {



// this is how to interact with the EWD and hence the M database
// via a series of web socket calls

onSocketMessage: function(ewd) {
var wsMsg = ewd.webSocketMessage;
var type = wsMsg.type;
var params = wsMsg.params;
var sessid = ewd.session.$('ewd_sessid')._value;


// this is just a test message
if (type === 'sendHelloWorldX') { 
ewd.log('*** Incoming Web Socket message received: ' + JSON.stringify(params, null, 2), 1);
var savedMsg = new ewd.mumps.GlobalNode('%AMessage', []);
savedMsg._setDocument(wsMsg);
return {savedInto: '%AMessage'};
}


// this is the start of the useful EWD calls
// this one calls the patient list
// it creates a node on the M database and then stores the JSON document in there
if (type === 'getPatientList') {

var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
console.log("Setting up new M variable");
// note that you need a name for a global with '' .. a number.. 
// must have ewd.mumps.GlobalNode
// with [ and ' around it and end the number with ' and ]
console.log("trying to set JSON to M");

//#########this is where we set the json to the M database with setDocument
HospitalZ._setDocument(testPatients);
// #### this is where we end setting that json to M database 

// now show that we can get JSON out of the M DB with getDocument
var Houtput = HospitalZ.Patients._getDocument();
var ListPatients = "{" + Houtput  + "}"; // set up new object
//series of console logs to compare outputs
console.log("JSON output from M to follow...");
console.log("Patients:" + JSON.stringify(Houtput, null, 4));
console.log(JSON.stringify(testPatients, null, 4));
console.log(JSON.stringify(ListPatients, null, 4));


return Houtput;
}


// have decided to use server side JS to do calls for Male & Female patients
// am sure there are better ways to do this

if (type === 'getPatientListFemales') {
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
console.log("trying to set JSON to M");

// #### this is where we end setting that json to M database 
HospitalZ._setDocument(testPatients);
// show that we can get JSON out of the M DB
var Houtput = HospitalZ.Patients._getDocument();

return Houtput;
}


if (type === 'getPatientListMales') {
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
console.log("trying to set JSON to M");

// #### this is where we end setting that json to M database
HospitalZ._setDocument(testPatients);
// show that we can get JSON out of the M DB
var Houtput = HospitalZ.Patients._getDocument();

return Houtput;
}


// this is where we get the Patient Statements out
if (type === 'getPatientStatements') {
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001']);
//console.log("Setting up new M variable");
//console.log("trying to set JSON to M");

//#########this is where we set the json to the M database
HospitalZ._setDocument(PatientStatements);
// #### this is where we end setting that json to M database 

// show that we can get JSON out of the M DB
var PSoutput = HospitalZ.PatientStatements._getDocument();

console.log("PatientStatements:" + JSON.stringify(PSoutput, null, 4));

return PSoutput;
}



// this is where we add Patients to the M/ JSON database

if (type === 'add2PatientM') { 
// 2 forms for console logging.. in the EWD monitor and the regular node console
ewd.log('**Incoming PatientMonEWD message: ' + JSON.stringify(params, null, 2), 1);
console.log('**Incoming PatientMMM message: ' + JSON.stringify(params, null, 2), 1);

// get the current JSON doc of Patients
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001','Patients']);
var Hinput = HospitalZ._getDocument();

// we take the parameters that are being passed in this call
// and "push" it into the JSON
var patientY = params; 
Hinput.push(patientY);
// then set the JSON document again
HospitalZ._setDocument(Hinput);

// then a large console log so we can see it
console.log(JSON.stringify(Hinput, null, 4));
console.log("+++++++€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€+++++++++++++++++++++++++++++++");

return true;
}


// this is where we add Patients to the M /JSON database
if (type === 'addStatements2PatientEHR') { 
// 2 forms for console logging.. in the EWD monitor and the regular node console

ewd.log('**Incoming StatementEWD message: ' + JSON.stringify(params, null, 2), 1);
console.log('**Incoming StatementM message: ' + JSON.stringify(params, null, 2), 1);

// get the current JSON doc of Patient statements
var HospitalZ = new ewd.mumps.GlobalNode('HospitalZ', ['0001','PatientStatements']);
var Sinput = HospitalZ._getDocument();

// take the parameters being sent
var ptstatements = params; 
// and "push" them into the JSON array
Sinput.push(ptstatements);

// then set an update version of the JSON doc in the M database
HospitalZ._setDocument(Sinput);


// then a large console log so we can see it
console.log(JSON.stringify(Hinput, null, 4));
console.log("+++++++&&&&&&&&&&&&&&&+++++++++++++++++++++++++++++++");

return true;
}


// Exploring the JSON on the M database
// if you want to explore the M database//
// go to linux command line/
// type mumps -dir
// then 
// zwr ^HospitalZ  
// zwr ^HospitalZ("0001","Patients",2,*)
// etc etc
// to explore the data


// Note re M /JSON database issue
// if poor data quality.. then need to "kill" elements of the global.. 
// but if you take number 5 of of 1,2,3,4,5,6,7.. then that messes up the return and the table looks empty
// so we currently needs to kill 5,6,7 to cut the array to 1,2,3,4
 
} // end of onSocketMsg
}; // end of modules