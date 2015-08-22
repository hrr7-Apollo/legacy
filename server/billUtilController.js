// bill id will appear something like this:

/*
"bill_id": "hconres1-100";
*/


// bill information will appear in the vote information as below
// the bill id is constructed from this object as such:
// "bill_id" = bill.type + "conres" + bill.number + "-" + bill.congress;

/*
"bill": {
  "congress": 113,
  "number": 1120,
  "type": "hr"
}
*/
