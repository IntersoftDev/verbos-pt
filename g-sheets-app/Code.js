/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current spreadsheet.
 */

//GLOBALS used throughout this Apps Script sheets extension project saved as "CreateJS".
var BuiltJS    = ""; //Each JS-code creation routine will use this to store created JS

// Output file names: these Google Docs files MUST EXIST in same directory as this G-Sheets
// workbook PRIOR to running this code, or it will error.  This is where the generated 
// JavaScript (JS) code will be written.
// 
// Prior to FIRST run ever, manually create empty G-DOC files with these names in your directory.
// When this G-Sheets script / extension is run, expect security warning(s) to be raised about 
// how this app needing access to the your G-drive (in order to write to these files).
// NOTE: the Dialog.html file (Extension UI def) should be updated to reflect new names also.
const JSConjugationRules_outputDocName = "jsPTVerbosCreateConjugationRulesData"; 
const JSKnownVerbs_outputDocName = "jsPTVerbosCreateKnownVerbsData";

// IMPORTANT CONSTANTS : MUST MATCH RESPECTIVE SHEET NAMES IN THE WORKBOOK
const vcrSheetName = "VerbConjugationRules";
const kvSheetName = "KnownVerbs";

// THESE CONSTANTS MUST BE UPDATED TO MATCH COLUMN INDEXES (ZERO-indexed) and/or COLUMN LETTERS within sheets.
// NOTE 1: If columns are inserted, removed, moved, etc, THESE MUST BE ALTERED TO MATCH COLUMNS and PRESERVE FUNCTIONALITY!!!
// NOTE 2: There are also some LOCAL CONST VALUES in some methods that MUST BE KEPT IN SYNC WITH COLUMN NUMBERS IN SHEETS!

// vcr... constants => related to sheet (of name: vcrSheetName) sheet
const vcrColIdx_VerboInfinitivo = 0;
//kv... constants => KnownVerbs sheet
const kvColIdx_VerboInfinitivo = 0;
const kvColNo_Popularity = 1; // A number representing approximate position in "top-1000" verbs; used assign top-10,25,50... groups later
const kvColNo_IRStemsVowelPos = 2; // If dealing with IR-Stem-changing type verbs, this is the pivot-vowel position in the verb (1-indexed)
const kvColNo_Prefix = 6; // If the verb conjugations can be built using the same rules as a another verbb, with diff only being this prefix
const kvColNo_RuleMatched = 7; // Contains the key value, to sheet (of name: vcrSheetName) entry, that a verb uses to compute conjugations 
const kvColLetter_RuleMatched = 'H'; // Ditto, but column-LETTER (vs index)
const kvColNo_IsDefective = 8; // Defective / Impersonal, thus not conjugated in all forms
const kvColNo_AltParticiples = 9; // If there are additional and/or non-standard participles, they exist here

/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Launch JS-File-Creation dialog', 'showDialog')
      .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Opens the dialog whose UI structure is defined in Dialog.html 
 */
function showDialog() {
  var ui = HtmlService.createTemplateFromFile('Dialog')
      .evaluate()
      .setWidth(600)
      .setHeight(440);
  SpreadsheetApp.getUi().showModalDialog(ui, "Verbos custom Processing Options"); //2nd parm is dialog Title 
}


/**
 *************  MAIN ENTRY POINT  *******************
 *  Execute Verbos custom code to produce desired JS.
 *  ULTIMATELY, THIS IS A JS-CODE-GENERATOR that uses
 *  data in 2 spreadsheets to produce essential maps
 *  of Portuguese Verbs and Conjugation Rules info 
 *  that is consumed in a web-app which efficiently  
 *  produces, via code and this limited data, the
 *  various data needed for a PT Verbs Conjugator 
 *  and Quiz tool. 
 ****************************************************
*/
function executeChosenAction(runOption) {
  Logger.log('Running... executeChosenAction(${runOption})');
  BuiltJS = "";
  
  switch (runOption) {
    case "ConjRules":
      createConjRulesJS();
      break;
    case "KnownVerbs":
      createKnownVerbsJS();
      break;
    case "CalcMatches":
      calculateVerbEndingMatchedRule();
      break;
    default:
      Logger.log("UNKNOWN RUN OPTION ENCOUNTERED in Code.js executeChosenAction().");
      break;
  }  
} //executeChosenAction


/**
 * Updates the RuleMatched column within the sheet (of name: kvSheetName), 
 * for rows 3-EOF (ignores top 2 header lines),by determining, for each KnownVerb, 
 * what conjugation-rule to use based on its ending letters.
 */
function calculateVerbEndingMatchedRule() {
  //Choose the KnownVerbs sheet. If exists, sheetValues is ALL the data therein.
  let verbsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(kvSheetName);
  if (verbsSheet == null) return;
  let verbsSheetRange  = verbsSheet.getDataRange();
  let verbsSheetValues = verbsSheetRange.getValues();

  let rulesSheet =  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(vcrSheetName);
  if (rulesSheet == null) return;
  let rulesSheetRange  = rulesSheet.getDataRange();
  let rulesSheetValues = rulesSheetRange.getValues();

  let wasRuleFound = false;

  //Cycle through Rules from last row to first (Note: row-zero is heading row); find first non-full word starting row
  //that is used as starting point for remaining bottom-to-top (of sheet) partial-ending searches.
  let rowIdxLastNonWordRule = 0;
  for (var rRowNo = rulesSheetValues.length - 1; rRowNo > 0; rRowNo--) {
    //If first-char in Rules VerboInfinitive is no longer a period, no more entire-word matches to consider.
    if (rulesSheetValues[rRowNo][vcrColIdx_VerboInfinitivo].charAt(0) !== ".") {
      rowIdxLastNonWordRule = rRowNo; //keep: this is 
      break; 
    }
  } //for...


  //NOTE: Rows/Columns are zero-indexed (i.e., the first row or column is number ZERO)
  // Start at row 2, just below the headings (rows zero and one) and the ArrayFormulas row (row-1).
  for (var vRowNo = 2; vRowNo < verbsSheetValues.length; vRowNo++) {

    let cellRuleToUpdate = verbsSheet.getRange(`${kvColLetter_RuleMatched}${(vRowNo + 1)}`); //E.g., set Cell "H###" where H is "RuleMatched" column
    
    //Only process Verbs that are NOT Prefixed!
    if (verbsSheetValues[vRowNo][kvColNo_Prefix].trim() !== "") {
      cellRuleToUpdate.setValue(''); //make sure no prior rule data in prefixed.
      continue; // skip to next row
    }
    cellRuleToUpdate.setValue('PREP'); //Default the cell value to make it obvious if no Rule matches found!

    wasRuleFound = false;
    //Test for exact full-word match; cycle from last row to first (Note: row-zero is heading row)
    for (var rRowNo = rulesSheetValues.length -1; rRowNo > rowIdxLastNonWordRule; rRowNo--) {

      //If first-char in Rules VerboInfinitive is no longer a period, no more entire-word matches to consider.
      if (rulesSheetValues[rRowNo][vcrColIdx_VerboInfinitivo] === ("." + verbsSheetValues[vRowNo][kvColIdx_VerboInfinitivo].trim())) {
        cellRuleToUpdate.setValue(rulesSheetValues[rRowNo][vcrColIdx_VerboInfinitivo]);
        wasRuleFound = true; //done processing this KnownVerb
        break; 
      }
    } //exact full-word match search loop

    if (wasRuleFound) continue; //Read the next ROW from KnownVerbs in outer for loop

    //Search for longest-partial-word-ending match
    for (var rRowNo = rowIdxLastNonWordRule; rRowNo > 0; rRowNo--) {
      let ruleVal = rulesSheetValues[rRowNo][vcrColIdx_VerboInfinitivo].trim(); 
      let kvVal = verbsSheetValues[vRowNo][kvColIdx_VerboInfinitivo].trim();
      if (kvVal.length < ruleVal.length) continue; //can't be a match if KnownVerb is less chars than rule!

      //If the ending characters of the Rule match the ending chars of the KnownVerb, use that rule
      if (ruleVal === kvVal.slice(-1 * ruleVal.length) ) {
        cellRuleToUpdate.setValue(ruleVal);
        wasRuleFound = true; //done processing this KnownVerb
        break;          
      }
    } //for
    
    if (!wasRuleFound) {
      cellRuleToUpdate.setValue('NO-RULE-FOUND!'); //Should NEVER happen unless sheet-data has issues
    }
  } //for verbs row iteration  

} //calculateVerbEndingMatchedRule


/**
 * Updates the output G-Doc (in this directory, of name: JSKnownVerbs_outputDocName).
 * Writes the known verbs information, including opening comments, in valid JavaScript, 
 * as needed for manually pasting, in its entirety, into the top of the file 
 * "known-verbs.js" within the web-application portion of this Verbos project/product.
 */
function createKnownVerbsJS() {
  let outputDocFile = getQueryOutputDocument(JSKnownVerbs_outputDocName); 
  if (outputDocFile == null) return;  //if appropriate G-Doc (name) not located, get out of here!
  outputDocFile.setDescription("PT Verbos KnownVerbs Data-Creation Built-JS");

  //Select the proper sheet within workbook.
  let verbsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(kvSheetName);
  if (verbsSheet == null) return;

  // This represents ALL the data in sheet
  var sheetRange  = verbsSheet.getDataRange();
  var sheetValues = sheetRange.getValues();

  //Place the generated JS into a single string to be written to the Doc
  BuiltJS =  '//mKv: known-verbs Map.\n';
  BuiltJS += '// Keyed on VerboInfinitivo, Values are an array of the following key/value pairs:\n';  
  BuiltJS += '// Y : (number) Popularity grouping-number (1 - 9; 1 being most commonly used verbs).\n';  
  BuiltJS += '// M : (number) 1-indexed IR Stem Vowel position in verb (entry omitted if n/a).\n';  
  BuiltJS += '// P : (string) Verb Prefix char(s) (omitted if n/a).\n';  
  BuiltJS += '// R : (string, nullable) Rule(conjugation); matched-ending-of-verb rule to use.\n';  
  BuiltJS += '// K : (string) Knockouts(conjugation) exist - Defective/Impersonal ("1" if True; entry omitted if False).\n';  
  BuiltJS += '// L : (string) Alternate Past Participle(s): (omitted if n/a).\n';  
  BuiltJS += 'export var mKv = new Map();\n';
  BuiltJS += 'const m = mKv;\n';  //shrinks output by 2Kb
  BuiltJS += getFormattedKnownVerbsValuesJS(sheetValues) + "\n";
  
  outputDocFile.setContent(BuiltJS);  
} //createKnownVerbsJS



/**
 * Builds a string with all the Map() entries for Known Verbs
 * @return String with ALL the values.
 */
function getFormattedKnownVerbsValuesJS(sheetValues) {
  let sValJS = "";
  
  //NOTE: Rows/Columns are zero-indexed (i.e., the first row or column is number ZERO)
  // Start at row 2, just below the headings (rows zero and one) and the ArrayFormulas row (row-1).
  for (var rowNo = 2; rowNo < sheetValues.length; rowNo++) {
    //our JS known-verbs Map will be keyed on the VerboInfinitivo.
    sValJS += `m.set("${sheetValues[rowNo][kvColIdx_VerboInfinitivo].trim()}",{`;
   
    //NOTE: Below, only interested in the certain columns (these are zero-indexed; thus, want columns 1 - 3, 6)  
    //Popularity column (number, optional) : change to default pop-groupings for UI (0 means unknown => group 9)
    let pop = ((sheetValues[rowNo][kvColNo_Popularity]) ? parseInt(sheetValues[rowNo][kvColNo_Popularity].toString()) : 0);
    switch (true) {
        case (pop > 500): pop = 7; break; //top 1000
        case (pop > 250): pop = 6; break; //top 500
        case (pop > 100): pop = 5; break; //top 250
        case (pop > 50):  pop = 4; break; //top 100
        case (pop > 25):  pop = 3; break; //top 50
        case (pop > 10):  pop = 2; break; //top 25
        case (pop > 0):   pop = 1; break; //top 10
        default: pop = 9; //Unknown (Not top-1000
    }
    sValJS += ((sheetValues[rowNo][kvColNo_Popularity]) ? `Y:${pop},` : "");

    //IR Stem Vowel Pos (number, optional)
    sValJS += ((sheetValues[rowNo][kvColNo_IRStemsVowelPos]) ? `M:${sheetValues[rowNo][kvColNo_IRStemsVowelPos].toString()},` : "");
    
    //Prefix (string, optional) (note: String Interpolation uses Grave Accents -- back ticks)
    sValJS += ((sheetValues[rowNo][kvColNo_Prefix]) ? `P:"${sheetValues[rowNo][kvColNo_Prefix].trim()}",` : "");
 
     //Knoockout-Verb Indicator; i.e., Defective/Impersonal verb w/o all conjugates: JS True ("1") or omit
    sValJS += ((sheetValues[rowNo][kvColNo_IsDefective]) ? `K:"${sheetValues[rowNo][kvColNo_IsDefective].toString()}",` : "");
   
    //ALT/Secondary Past Participle (string, opt.) 
    sValJS += ((sheetValues[rowNo][kvColNo_AltParticiples]) ? `L:"${sheetValues[rowNo][kvColNo_AltParticiples].trim()}",` : "");

    //Rule (string, nullable) : this is the value the mapRules() is indexed on, for conj-rule-lookups.
    sValJS += 'R:' + ((sheetValues[rowNo][kvColNo_RuleMatched]) ? `"${sheetValues[rowNo][kvColNo_RuleMatched].trim()}"` : "null");
    
    sValJS += "});\n";
  } //row iteration  

  return sValJS;
} //getFormattedKnownVerbsValuesJS


/**
 * Updates the output G-Doc (in this directory, of name: JSConjugationRules_outputDocName).
 * Writes the verbs conjugation rules information, including opening comments, in valid JavaScript, 
 * as needed for manually pasting, in its entirety, into the top region of the file 
 * "formed-verbs.js" within the web-application portion of this Verbos project/product.
 */
function createConjRulesJS() {
  let outputDocFile = getQueryOutputDocument(JSConjugationRules_outputDocName); 
  if (outputDocFile == null) return;  //if appropriate G-Doc (name) not located, get out of here!
  outputDocFile.setDescription("PT Verbos ConjugationRules Data-Creation Built-JS");

  //Select the proper sheet within workbook.
  let rulesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(vcrSheetName);
  if (rulesSheet == null) return;
  
  // This represents ALL the data
  let sheetRange  = rulesSheet.getDataRange();
  let sheetValues = sheetRange.getValues();
 
  //Place the JS into a single string to be written to the Doc
  BuiltJS = `/*============================================================================================
mapRules is the Verb conjugation-endings build-rules Map.
Map() Keys   : the verb-ending-chars to be matched on.
Map() Values : an Array of Arrays, these arrays being: 

⇒ elem[0] = (string, nullable) Inheritance-Chain-Rule; if value, points back into this Map() with that key value
⇒ elems [1] = empty array placeholder only, so that subsequent array elements 2-13 align with VerbTenses.
⇒ elems 2 - 13 (VerbTenseID) : each of these arrays can contain another Array: 
   ... which holds the potential SIX Verb-Subjects (1-6) and their values (the CONJUGATION-ENDINGS).
       Note that [3] and [4], the participles, are either empty or have one value applicable to ALL Verb-Subjects;
   ... a null for the entire VerbTense value indicates inherited rule applies to ALL subjects, whereas ...
   ... a single null within one of the 6 subject values indicates specific subject has inherited conjugation-ending.
⇒ elems 14 (UserNotes) : optional notes about the verb ending
============================================================================================*/;  
var mapRules = new Map();\n`;
  BuiltJS += getFormattedConjRulesValuesJS(sheetValues) + "\n";
  
  outputDocFile.setContent(BuiltJS);    
} //createConjRulesJS



/**
 * Builds a string with all the Map() entries for Conjugation Rules.
 * sheetValues are from sheet (of name: vcrSheetName).
 * @return String with ALL the values.
 */
function getFormattedConjRulesValuesJS(sheetValues) {
  let sValJS = '';
  let cellString = '';
  let arrSplit = [];
  let cellStringParsed = '';
  const lastColToInclude = 12; //Columns are ZERO-indexed. This is col "M" (FutureSubjunctive), which is the last verb-tense to include.
  const inheritRuleColNo = 14;
  const userNotesCol = 15;
  
  //NOTE: Rows/Columns are zero-indexed (i.e., the first row or column is number ZERO)
  // Start at row 1, just below the headings row-zero.
  for (var rowNo = 1; rowNo < sheetValues.length; rowNo++) {
    //our JS rules Map will be keyed on the verb-ending-chars to be matched on (this is Column 0 in sheet; i.e., VerboInfinitivo column).
    sValJS += `mapRules.set("${sheetValues[rowNo][vcrColIdx_VerboInfinitivo].trim()}",[`; //BEGIN OUTER-ARRAY
   
    //Outer-Array[0]: Inheritance-Chain-Rule value (InheritedRuleVInf); use empty-array to indicate null (no inheritance rule)
    sValJS += ((sheetValues[rowNo][inheritRuleColNo] === '') ? '' : `"${sheetValues[rowNo][inheritRuleColNo]}"`);

    //Outer-Array elem [1] is placeholders only. 
    //This makes Outer-Array element numbers 2-13 correspond to VerbTenseIDs 2-13 
    sValJS += ','; 

    //Each of the Verb Tenses in outer array by VerbTenseID (numeric) is really Spreadsheet-Column-No +2 
    //i.e., Present Participle is Tense ID = 3 but in the spreadsheet it is Column #1
    for (var colNo = 1; colNo <= lastColToInclude; colNo++) {
     
      //Test for "empty" cells  -- comma-delim parse to nulls)
      if ((sheetValues[rowNo][colNo]) && (sheetValues[rowNo][colNo].trim() != "")) {
        //remove any whitespace issues... extraneous spaces would cause issues in JS-Server value-parsing.
        cellString = sheetValues[rowNo][colNo].replace(/\s+/g, '');
        if (cellString !== sheetValues[rowNo][colNo]) {
          Logger.log(`Extraneous whitespace detected in cell at row:col= ${(rowNo + 1).toString()}:${String.fromCharCode(colNo + 65)}`);
        }
        
        if ((colNo === 2) || (colNo === 3)) {
          //Participles (Spreadsheet cols C/D) have only one form, applicable to ALL Subjects
          sValJS += `,["${cellString}"]`;
        }
        else {
          //All other verb tenses have six Subjects: test for 5 commas in columns where needed (i.e., if not null, must have total of 5 commas)
          if ((cellString !="") && ((cellString.match(/,/g)||[]).length != 5)) {
            Logger.log("Incorrect verb-form-count (i.e., not 6!) detected in cell at row:col=" + (rowNo + 1).toString() + ":" + String.fromCharCode(colNo + 65));
          }
          
          //Break apart at commas, set EMPTY VALUES to null, such that a cell value like 
          //"requeiro,,requer,,," is rewritten in output as: '"requeiro",null,"requer",null,null,null'
          arrSplit = cellString.split(',');
          cellStringParsed = '';
          for (var elNo = 0; elNo <=5; elNo++ ) {
            cellStringParsed += (arrSplit[elNo] === "" ? "null" : `"${arrSplit[elNo]}"`) + (elNo !== 5 ? "," : "")
          }
          sValJS += `,[${cellStringParsed}]`;
        }
      } else {
        //This section handles the situation where the ENTIRETY of a verb tense has no overrides (and is thus, not defined / null) 
        sValJS += ",[]";
      }
      
    } //column iteration

    //any userNotes to include?
    sValJS += ((sheetValues[rowNo][userNotesCol] === '') ? '' : `,"${sheetValues[rowNo][userNotesCol]}"`);

    sValJS += "]);\n";
  } //row iteration  

  return sValJS;
} //getFormattedConjRulesValuesJS



/**
 * Locate the desired Query-Output Google Apps doc
 *
 * @return File object.
 */
function getQueryOutputDocument(outFileName) {
  //This had better be only ONE file!!
  const filesWithSpecifiedName = DriveApp.getFilesByName(outFileName); 
  
  //Normally, we'd iterate using a while () here, but we ONLY WANT ONE FILE EVER!
  if (filesWithSpecifiedName.hasNext()) {
    var outFile = filesWithSpecifiedName.next();
    Logger.log(outFile.getName());
    return outFile;
  } else {
    Logger.log("Output outFileName NOT FOUND!");
    return null; //EXIT NOW if no matching file.
  }  
} //getQueryOutputDocument



/**
 * IMPLEMENTS NEW SPREADSHEET FUNCTION CALLED "REVERSE". In a cell, simply =REVERSE(A1), etc.
 * Reverses the input text.
 *
 * @param {string} input The text to reverse.
 * @return The input text reversed.
 * @customfunction
 */
function REVERSE(string) {
  if (typeof string != 'string') {
    return null;
  }
  return string.split('').reverse().join('');
}