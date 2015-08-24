// these are 10 test bills associated with Bernie Sanders
// his list of votes can be found here:
// https://www.govtrack.us/api/v2/vote_voter/?person=400357
// get the id from the property "related_bill"
// and find the fill at https://www.govtrack.us/api/v2/bill/ + bill id

db.billentries.insert({
  "id": "0",
  "bill_id": "64062",
  "terms": [
    "Budget deficits",
    "Congressional budget",
    "Federal budgets",
    "Federal receipts and expenditures",
    "Government spending reductions",
    "Discrimination in employment",
    "Congress",
    "Congressional candidates",
    "Congressional committee chairmen",
    "Congressional committees (House)",
    "Congressional employees",
    "Congressional ethics",
    "Congressional Record",
    "Congressional sessions",
    "Franking privilege",
    "House of Representatives",
    "House rules and procedure",
    "Legislation",
    "Legislative resolutions",
    "Members of Congress (House)",
    "Record votes",
    "Economic impact statements",
    "Federal employees",
    "Overtime",
    "Political ethics",
    "Ethics",
    "Science, Technology, Communications", 
  ]
});

db.billentries.insert({
  "id": "1",
  "bill_id": "57436",
  "terms": [
    "Congressional oversight",
    "Congressional-Presidential relations",
    "War and emergency powers",
    "Declaration of war",
    "Military intervention",
    "Military occupation",
    "International Affairs", 
  ]
});

db.billentries.insert({
  "id": "2",
  "bill_id": "63388",
  "terms": [
    "Congressional oversight",
    "Congressional-Presidential relations",
    "War and emergency powers",
    "Defense burdensharing",
    "Declaration of war",
    "Military intervention",
    "Military occupation",
    "Sanctions (International law)",
    "International Affairs", 
  ]
});

db.billentries.insert({
  "id": "3",
  "bill_id": "56638",
  "terms": [
    "Congressional oversight",
    "Congressional reporting requirements",
    "Congressional-Presidential relations",
    "War and emergency powers",
    "Armed forces abroad",
    "Military intervention",
    "Military occupation",
    "Sanctions (International law)",
    "United Nations",
    "International Affairs", 
  ]
});

db.billentries.insert({
  "id": "4",
  "bill_id": "63647",
  "terms": [
    "Congressional tributes",
    "Armed forces abroad",
    "Military intervention",
    "Military occupation",
    "Persian Gulf War",
    "Armed Forces and National Security",
    "Government Operations and Politics", 
  ]
});

db.billentries.insert({
  "id": "5",
  "bill_id": "63671",
  "terms": [
    "Congressional tributes",
    "Persian Gulf War",
    "War casualties",
    "American military assistance",
    "Aggression",
    "International Affairs", 
  ]
});

db.billentries.insert({
  "id": "6",
  "bill_id": "55880",
  "terms": [
    "Human rights",
    "Military occupation",
    "Persian Gulf War",
    "Prisoners of war",
    "International cooperation",
    "International Affairs", 
  ]
});

db.billentries.insert({
  "id": "7",
  "bill_id": "53677",
  "terms": [
    "Armed forces abroad",
    "Military dependents",
    "Military intervention",
    "Military occupation",
    "Military personnel",
    "Persian Gulf War",
    "War casualties",
    "Interest",
    "Hospital patients",
    "Income tax",
    "Tax administration",
    "Tax refunds",
    "Taxation", 
  ]
});

db.billentries.insert({
  "id": "8",
  "bill_id": "55358",
  "terms": [
    "Survivors' benefits",
    "Veterans' benefits",
    "Veterans' disability compensation",
    "Armed Forces and National Security", 
  ]
});

db.billentries.insert({
  "id": "9",
  "bill_id": "54134",
  "terms": [
    "Human rights",
    "Violence",
    "Military intervention",
    "Recognition (International law)",
    "Summit diplomacy",
    "Annexation (International law)",
    "Dispute settlement",
    "National self-determination",
    "Negotiations",
    "Sanctions (International law)",
    "Sovereignty",
    "Treaties",
    "United Nations",
    "Democracy",
    "International Affairs", 
  ]
});
