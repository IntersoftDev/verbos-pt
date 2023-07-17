//Copyright © Michael Eberhart (suretalent.blogspot.com), 2023, All Rights Reserved
import * as formedVerbs from './formed-verbs.js';
import * as vTenses     from './verb-tenses.js';
import * as vSubjects   from './verb-subjects.js';
import * as knownVerbs  from './known-verbs.js';

/*
█████
MAIN:
█████
*/
const sKey = 'PTverbQuiz_'; //prefix for storage keys
var userStorage;
try {
    userStorage = window.localStorage;  //storage only avail if hosted 
} catch(e) {
    userStorage = undefined;
}

//Options configurable by user on Settings page
let vOpts = {
    //Misc settings for display config
    showVerbInfoOnConj:true,  //no space between : and true!!
    showSubjInfoOnConj:false,
    //Verb-dropdown filtration options
    vPop:9, //popularity-rank
    vTyp:0, //classification
    //Quiz/Conj: which to include...
    QshowTense:[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    CshowTense:[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    QshowSubj:[true,true,true,true,true,true,true],
    CshowSubj:[true,true,true,true,true,true,true]
};

//If possible, get saved settings
if (!userStorage.getItem(`${sKey}options`)) { 
    userStorage.setItem(`${sKey}options`, JSON.stringify(vOpts)); 
} else {
    vOpts = JSON.parse(userStorage.getItem(`${sKey}options`)); 
}


const divWorkArea = document.getElementById('workarea');
formedVerbs.loadTerConjucations(); //MUST BE DONE FIRST for compound-verbs readiness.

/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Setup auto-completion in the verb-selection input box.
The unique known verbs provides the data-source for the auto-select dropdown control
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/

const editVerbo = document.getElementById('inVerbs');
let verbsAutoComplete = new AutoCompleteDropdownControl(editVerbo);
verbsAutoComplete.limitToList = true;

verbsAutoComplete.optionValues = knownVerbs.getUniqueVerbsArray(vOpts);
//verbsAutoComplete.onSelect = function () {console.log('Verbo dropdown - onSelect Callback, value: ' +verbsAutoComplete.value);};
verbsAutoComplete.initialize();
editVerbo.focus(); //default to here

/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Helper routine to make sure a SPACE-CHAR is always ASCII-32 SPACE (i.e., regular space)
vs. an ASCII-160 non-breaking space (from HTML).
Returns charToStdz unless it was 160-space which changes to 32-space.
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function getStandarizedAsciiChar(charToStdz) {
    return ((charToStdz.charCodeAt(0) === 160) ? String.fromCharCode(32) : charToStdz);
}

/*
══════════════════════════════════════════════════════════════
These global variables are set when the selected verb changes.
══════════════════════════════════════════════════════════════
*/
let verb = '';              //The currently-selected Verb to cong/quiz
let verbLastTwoChars = '';  //ar, er, ir, or (or ôr)
let isPorVerb  = false;     //if the chosen verb is "pôr"
let isORVerb = false;       //if the verb-suffix is "or"

let arrFormedVerbs = [];

/*
═══════════════════════════════════════════════════════════════════════════════════════
This map provides a way to test for a letter being (partially) correct in that it only
differs by the accent type.
    mDc(letter-or-diacritic-key-vale, grouping-number)

If two compared letters (the key for lookup) return the same value (the group-number)
then the letter only differs an diacritic, whether completely missing or the wrong one.
═══════════════════════════════════════════════════════════════════════════════════════
*/
let mDc = new Map();
    mDc.set('a',1);
    mDc.set('á',1);
    mDc.set('â',1);
    mDc.set('ã',1);
    mDc.set('à',1);
    mDc.set('c',2);
    mDc.set('ç',2);
    mDc.set('e',3);
    mDc.set('é',3);
    mDc.set('ê',3);
    mDc.set('i',4);
    mDc.set('í',4);
    mDc.set('o',5);
    mDc.set('ó',5);
    mDc.set('ô',5);
    mDc.set('õ',5);
    mDc.set('u',6);
    mDc.set('ú',6);

/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Handle  button-clicks (or enter-key-press on button) for Quiz / Conjugation selection

When using DIV-Based buttons, must use mouseDOWN event to prevent the active-control/focus
from shifting to the button during the mouseup portion of onclick; use preventDefault to
short-circuit further propagation too.
 I.e., if using normal HTML input type="button" controls, .onclick() works fine.
 https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
document.getElementById('action-buttons').onkeydown = function(event) {
    if (event.key === "Enter") { btnActionProcess(event);}
};

document.getElementById('action-buttons').onmouseup = function(event) {
    btnActionProcess(event);
}; 


function btnActionProcess(event) {
    //Exit if no id property set on clicked element
    if (!event.target.id) return;
    
    let clickTarget = document.getElementById(event.target.id); //use Class ID of click-target
    let tag = parseInt(clickTarget.getAttribute('data-tag')) || 0;

    let selVerb = verbsAutoComplete.value.toLowerCase();

    //Clear out prior Quiz/Conj.  https://jsperf.com/innerhtml-vs-removechild/418 - clear speed compare
    divWorkArea.innerText = '';

    //No verb-details needed for Config
    if (tag === 3) {
        SetupConfig();
        return;
    }
    if (!knownVerbs.doesVerbExist(selVerb)) return;

    /*
    ═══════════════════════════════════════════════════════════════════════════════════════
    Update global variables that accompany a verb-selection change
    ═══════════════════════════════════════════════════════════════════════════════════════
    */
    verb = selVerb;
    arrFormedVerbs = formedVerbs.getConjugatedVerbTenses(verb);

    verbLastTwoChars = selVerb.slice(-2);
    isPorVerb   = (selVerb === 'pôr'); 
    isORVerb    = ((verbLastTwoChars === 'or') || (verbLastTwoChars === 'ôr'));

    if (tag === 1) {
        SetupQuizUI();
    } else {
        SetupConjUI();
    }
} //btnActionProcess


/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Use Mutation-Observer features to trap UI changes:
1) typing inside answer-fields
2) pasting

https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
config = Options for the observer (which mutations to observe)
         subtree : catches keyboard events
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
const mutation_observer_config = { childlist: true, subtree: true, characterData: true, characterDataOldValue: true };

// Callback function to execute when mutations are observed
// https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
let answer_mutation_callback = function(mutationsList) {

    for (let mutation of mutationsList) {
        if ( (mutation.type === 'characterData') && (mutation.target.ownerDocument.activeElement !== undefined)) {
            let ansDivEl = mutation.target.ownerDocument.activeElement;
            let ansDivID = ansDivEl.id;
            let solDivID = 'v'+ ansDivID.substring(1);
            let solDivEl = document.getElementById(solDivID);
            let ddTenseID = parseInt(ansDivID.substring(2, 4));
            let subjID = parseInt(ansDivID.slice(-1)); //subjectID is last character

            onAnswerChange(
                mutation.target.data,
                arrFormedVerbs[ddTenseID][subjID].toString().slice(1), //Strip the regularity-indicator from conjugation
                ansDivEl, //answer DIV with ID="a-1-1" or such
                solDivEl  //solution DIV with ID="v-1-1" or such
                );
        }
    }
};


/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
When the user changes their answer, either by typing or pasting text, test each
character withing the latest answer value, comparing it to correct answer, and
set various attributes on the solutions-hint-characters to visually reflect progress.
Tests and actions:
    - Exact Match: flip/expose the solution letter
    - Match but not proper internationalization: do not flip, flag it as warning
    - Min-Length: during card-flip/style-setting, must consider reset of all if 0-len!
    - Max-length: simply don't allow beyond a certain size.
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function onAnswerChange(strCurAnswer, strVerb, elAnswer, elSolution) {
    let cardFront = null;
    let cardBack  = null;
    let idxSol    = 0;
    const verbLength = strVerb.length;

    let aChar = '';
    let vChar = '';
    let boolDiacriticdiff = false;
    let isCharFlipped = false;

    //Enforce max-length
    const maxAnswerLength = parseInt(elAnswer.getAttribute('data-maxlength'));
    let curAnswerLength = strCurAnswer.length;

    if (curAnswerLength > maxAnswerLength) {
        strCurAnswer = strCurAnswer.substring(0, maxAnswerLength);
        curAnswerLength = strCurAnswer.length;
        elAnswer.textContent = strCurAnswer;
    }

    //ensure upcoming comparisons find match regardless of upper/lowercase
    strCurAnswer = strCurAnswer.toLowerCase();
    strVerb = strVerb.toLowerCase();

    //If an answer is longer than expected, is it due to space(s) at end?
    if (curAnswerLength > verbLength) {
        strCurAnswer = strCurAnswer.trimRight();
        curAnswerLength = strCurAnswer.length;
    }

    //If user has hit exact-match for entire answer, flag it as such
    elAnswer.className = elAnswer.className.split(' success').join('');
    if (strCurAnswer === strVerb) {
        elAnswer.className += ' success';
    }

    /*
    ═══════════════════════════════════════════════════════════════════════════════════════
    The DOM construct for each group of verb-solution-cards is such that
    verb-div(e.g., v1_1).childNodes[letter-index-here].childNodes[0] ==> front of card
    (which is just used for its background color) and,
    childNodes[1] points to back of card and has the one char solution for that position.
    ═══════════════════════════════════════════════════════════════════════════════════════
    */
    for (let childnode of elSolution.childNodes) {
        cardFront = childnode.childNodes[0];
        cardBack = childnode.childNodes[1];

        //if previously flipped/exposed answer, perform highlights to exposed text-char vs. background-color only
        //otherwise, remove any warnings or errors
        isCharFlipped = cardBack.className.includes('flipped');
        if (!isCharFlipped) {
            cardFront.className = cardFront.className.split(' bg-error').join('');
            cardFront.className = cardFront.className.split(' bg-warn').join('');
        } else {
            cardBack.className = cardBack.className.split(' error').join('');
            cardBack.className = cardBack.className.split(' warn').join('');
        }

        vChar = getStandarizedAsciiChar(strVerb.charAt(idxSol));

        if ((curAnswerLength > 0) && (idxSol < curAnswerLength) && (idxSol < verbLength) ) {
            aChar = getStandarizedAsciiChar(strCurAnswer[idxSol]);
        } else {
            aChar = '#'; //to always mark a position as erroneous if already flipped previously but now missing in input!
        }

        if (aChar === vChar) {
            cardBack.className = cardBack.className.split(' backflipped').join('');
            cardBack.className += ' backflipped';
        } else {
            boolDiacriticdiff = (mDc.has(aChar) && mDc.has(vChar) &&
                                (mDc.get(aChar) === mDc.get(vChar) ) );

            if (!isCharFlipped && (aChar !== '#')) {
                //already know chars are different. See if it is just a diacritic variation
                cardFront.className += (boolDiacriticdiff ? ' bg-warn' : ' bg-error');
            }
        }

        idxSol++;
    }

} //onAnswerChange



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Build the UI as needed for Quiz
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function getCurrentVbSingleConjAsString(TenseID, subjectID) {
    const maxSubjects = vTenses.getMaxSubjCount(TenseID); //(Tenses 1,3,4 have 1; others have 6)
    return ((subjectID === 0) && (maxSubjects === 1) ? arrFormedVerbs[TenseID].toString() : arrFormedVerbs[TenseID][subjectID].toString());
}

function SetupQuizUI() {
    console.log("Quizzing");

    const showAllTenses = vOpts["QshowTense"][0];
    for (let i = 1; i <= 22; i++) {
        if (showAllTenses || (vOpts["QshowTense"][i])) CreateAnswerSolutionBlock(i);
    }
}


function CreateAnswerSolutionBlock(TenseID) {
    let builtHtml = '';
    let answerDivID = '';
    let solutionDivID = '';
    let solutionCardsHtml = '';
    let singleConjugation = '';
    let isRegular = true;

    const maxSubjects = vTenses.getMaxSubjCount(TenseID);
    for (let subjectID = 0; subjectID < maxSubjects; subjectID++) {
        const adjSubjectArrayID = subjectID + (maxSubjects > 1);
        if (!(vOpts["QshowSubj"][adjSubjectArrayID])) continue;

        singleConjugation = getCurrentVbSingleConjAsString(TenseID, subjectID);
        isRegular = singleConjugation.charAt(0) === '*';
        singleConjugation = singleConjugation.slice(1); //drop leading regularity-indicator

        //test for missing forms
        if (singleConjugation === "❌") continue;
        solutionCardsHtml = '';
        const vSubPTShort = vSubjects.getShortPTSubjLabel(adjSubjectArrayID);

        //build DIV ID values that differ only by first letter (a/v)
        let ddTenseID = ('0' + parseInt(TenseID).toString()).slice(-2); //zerofill and clamp to 2-chars
        answerDivID = `-${ddTenseID}-${subjectID}`;
        solutionDivID = 'v' + answerDivID;
        answerDivID = 'a' + answerDivID;

        for (let letter of singleConjugation) {
            solutionCardsHtml += `<div class="c"><div class="f"></div><div class="b">${letter}</div></div>`;
        }

        let IrregularIndicator = (isRegular ? '' : '<div class="irregularVerbDiv">&nbsp;*</div>');

        //Inline keydown handler prevents CR in field
        builtHtml += ((builtHtml !== '') ? '<hr>' : '') +
        `<div class="fields-row">
            <div>
                <div class="lbl-subj-short">${vSubPTShort}</div>
                <div id="${answerDivID}" class="edit-div" contenteditable="true" data-maxlength="30" spellcheck="false" onkeydown="if (event.keyCode === 13) return false;"></div>
            </div>
            <div class="solution">
                <div class="lbl-subj-short">${vSubPTShort}</div>
                <div id="${solutionDivID}" class="vhelp">${solutionCardsHtml}</div>${IrregularIndicator}
            </div>
        </div>`;

    } //for subjects

    //Check for no content (if someone turned off display of ALL subjects)
    if (builtHtml !== '') {
        let newDiv = document.createElement("div");
        newDiv.className = "quiz-tense-group";
        divWorkArea.appendChild(newDiv);

        const extraParticiple = ((TenseID !== 4) || (!(knownVerbs.getExistsAltParticiples(verb)))) ? '' : 
        `<span class="tense-example">* Additional Past Participle: <span class="altParticiple">${knownVerbs.getAltParticples(verb)}</span></span>`;

        const hdrTense = vTenses.getFullTenseHeadingTextByID(TenseID, "Q", verb) + extraParticiple;
        const columnHeaders = `<div><div class="field-label">Your Answer (and Solution/Hint-cards)</div></div>`;
        newDiv.innerHTML = hdrTense + columnHeaders + builtHtml;
    
        // Create an observer instance linked to the callback function
        let test_answer_observer = new MutationObserver(answer_mutation_callback);
        // Start observing the target node for configured mutations
        test_answer_observer.observe(newDiv, mutation_observer_config);
    
        /*
        ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        Paste-event intercept required to trigger a DOM change that the MutationObserver will
        catch.  Otherwise, when the field was empty prior to a paste (i.e., blank), the paste
        did not fire a DOM change (seems like a bug!).
        This also ensures pasted info is TEXT (i.e., stripped of HTML).
        ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        */
        newDiv.addEventListener('paste', (e) => {
            // Prevent the default pasting event
            e.preventDefault();
            let text = '';
            if (e.clipboardData || e.originalEvent.clipboardData) {
              text = (e.originalEvent || e).clipboardData.getData('text/plain');
            } else if (window.clipboardData) {
              text = window.clipboardData.getData('Text');
            }
            text = text.trimLeft();
            text = text.split('\n').join(''); //remove line breaks
    
            if (document.queryCommandSupported('insertText')) {
              document.execCommand('insertText', false, text);
            } else {
              document.execCommand('paste', false, text);
            }
    
            //NO FURTHER NEED TO CALL onAnswerChange() SINCE THIS PASTE-HANDLING WILL FORCE DOM-CHANGE!
        });

    } //if any subjects

} //CreateAnswerSolutionBlock


/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Create a Subject/Person explanation region at the beginning of the conjugated-verb
information. Loop through all available Subjects and build info.
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function createVerbSubjectInfoDivHtml(divToAppendTo) {
    let builtHtml = '';
    let newDiv = document.createElement("div");
    newDiv.className = "subject-help-group";
    divToAppendTo.appendChild(newDiv);

    for (let i = 0; i <= 6; i++) {
        builtHtml +=  ((builtHtml !== '') ? '<hr>' : '') + vSubjects.getFullSubjectDescHtmlByID(i);       
    }

    newDiv.innerHTML = `<div class="subject-hdr">Subjects of Verbs, Plurality, and Person Information. 
    <a href="https://en.wikipedia.org/wiki/Portuguese_verb_conjugation#Second_conjugation_(comer)" 
    target="_blank" rel="noopener noreferrer">See Wikipedia Page for Details</a></div>` + builtHtml;
}


/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Create an informative region (at the beginning of the conjugated-verbs and/or the quiz)
with information about things like:

- Verb frequency / popularity
- The suffix that was matched, which is the basis of the conjugationrules used.
- The prefix, that, once removed, will indicate which verb's conjugations can be used
  as a basis for creating this verb's conjugations. (i.e., only differ by prefix)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function createVerbInfoDivHtml(divToAppendTo, theVerb) {
    let newInfoDiv = document.createElement("div");
    newInfoDiv.className = "verb-info-group";
    divToAppendTo.appendChild(newInfoDiv);

    let unprefixedVerb = theVerb;
    let prefixNarrative = '';
    let matchNarrative = ``;
    let stemNotes = '';

    const verbPrefix = knownVerbs.getPrefix(theVerb);
    if (verbPrefix !== '') {
        unprefixedVerb = theVerb.substring(verbPrefix.length);
        const isUnprefixedPor = (unprefixedVerb === 'por');
        const modUnprefixed = (isUnprefixedPor ? "pôr" : unprefixedVerb);

        prefixNarrative = `<div>Prefix: <span class="subject-note"><b>${verbPrefix}</b> &mdash; 
            notice that ${isUnprefixedPor ? '<span class="underline">most</span>' :'all'} conjugated forms of ${theVerb} are identical to the corresponding
            conjugated form of the verb <b>${modUnprefixed}</b> with the only difference being this prefix.</span></div>`;
    }

    let matchedSuffix = arrFormedVerbs[0].toString();

    let isRegular = (matchedSuffix.length === 2); 
    //Handle a few rule-breakers, where in the G-sheets, a rule simply redirects to REGULAR (ar/er/ir/or)
    switch (unprefixedVerb) {
        case "exibir": //IBIR ending, but only uses IR, unlike .exibir 
        case "unir":   //both full word and endings of unir, but NOT reunir (specific)
            isRegular = true;
            break;
    }

    const isStemChangeVerb = (knownVerbs.getIRstemPos(unprefixedVerb) !== null);
    matchedSuffix = matchedSuffix.replace(".", "[entire verb] ");

    if ((isRegular) && (!isStemChangeVerb)) {
        matchNarrative = `uses standard <b>${verbLastTwoChars}</b>-verb conjugation rules for all verb forms.`;
    } else {
        if (isStemChangeVerb) {
            const stemPos = parseInt(knownVerbs.getVerbEntryByInfinitive(unprefixedVerb)["M"]) + verbPrefix.length;
            stemNotes = `<br><hr>This is also an <b>IR-stem-changing verb &mdash;
                with the stem-vowel in character position ${stemPos}</b> changing in certain Present and Subjunctive tense verb forms.`;
        }

        matchNarrative += `this verb includes <span class="irregularVerb">irregular conjugations</span>
            &mdash; the <span class="irregularVerb">highlighted conjugations</span> below do not follow 
            standard <b>${isPorVerb ? 'or' : verbLastTwoChars}</b>-verb-ending conjugation rules. ${stemNotes}`;
        
        if (!isRegular) {
            matchNarrative += `<br/><hr><span class="irregularVerb">Irregular forms</span> follow these verb-ending rule(s):
            <b>${matchedSuffix}</b>.${formedVerbs.getUserNotes(arrFormedVerbs[0].toString())}`;
        }

        if (knownVerbs.getIsDefective(theVerb)) {
            matchNarrative += `<br/><hr>This verb is designated as <span class="defectiveVerb">Defective / Impersonal</span> &mdash;
             as such, it is not typically conjugated in all tenses and/or subects(persons); although rare, figurative and metaphorical usage
             does allow additional conjugated forms otherwise omitted &mdash; e.g., haver is fully conjugated when used in literary
             auxiliary functions.`;
        }
    }

    if (knownVerbs.getExistsAltParticiples(theVerb)) {
        matchNarrative += `<br/><hr><span class="altParticiple">Additional Past Participle</span> exists for this verb.`;
    }

    if (verbPrefix !== '') {
        prefixNarrative = `<hr>Note how conjugations align with those of the un-prefixed form of this verb: <b>${(isORVerb ? "pôr" : unprefixedVerb)}</b>.`;
    }   

    if (isORVerb) {
        matchNarrative += ` Historical note: or-ending verbs used to be er-ending verbs (and pôr was formerly poer).`;
    }

    const builtVerbInfo = `
        <div>Verb Frequency Ranking: <b>${(knownVerbs.getPopularityBandLabel(theVerb))["label"]}</b></div><hr>
        <div>Conjugation-construction information: <span class="subject-note">${matchNarrative}</span></div>
        ${prefixNarrative}
        <br/><hr><a href="https://www.infopedia.pt/dicionarios/lingua-portuguesa/${theVerb}" target="_blank" rel="noopener noreferrer">Click this link for ${theVerb} definitions</a> 
        in Dicionário infopédia da Língua Portuguesa.
        `;

    newInfoDiv.innerHTML = '<div class="verb-info-hdr">Verb Information</div>' + builtVerbInfo;

} //getVerbInfoDivHtml


/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Build the UI for Conjugator Page
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function SetupConjUI() {
    console.log("Conjugating");

    if (vOpts["showVerbInfoOnConj"]) createVerbInfoDivHtml(divWorkArea, verb);
    if (vOpts["showSubjInfoOnConj"]) createVerbSubjectInfoDivHtml(divWorkArea);

    const showAllTenses = vOpts["CshowTense"][0];
    for (let i = 1; i <= 22; i++) {
        if (showAllTenses || (vOpts["CshowTense"][i])) CreateConjTenseBlock(i);
    }
}


function CreateConjTenseBlock(TenseID) {
    let builtHtml = '';
    let aFormedVerbHtml = '';
    let singleConjugation = '';
    let isRegular = true;
    const hdrTense = vTenses.getFullTenseHeadingTextByID(TenseID, "C", verb);

    const maxSubjects = vTenses.getMaxSubjCount(TenseID);
    for (let subjectID = 0; subjectID < maxSubjects; subjectID++) {
        const adjSubjectArrayID = subjectID + (maxSubjects > 1);
        if (!(vOpts["CshowSubj"][adjSubjectArrayID])) continue;
        
        const shortPTsubj = vSubjects.getBriefPTSubjectDescByID(adjSubjectArrayID);
        const extraParticiple = ((TenseID !== 4) || (!(knownVerbs.getExistsAltParticiples(verb)))) ? '' : 
        `<br/><span class="altParticiple">${knownVerbs.getAltParticples(verb)}</span>`;

        singleConjugation = getCurrentVbSingleConjAsString(TenseID, subjectID);
        isRegular = singleConjugation.charAt(0) === '*';
        singleConjugation = singleConjugation.slice(1); //drop leading regularity-indicator
        aFormedVerbHtml = (isRegular ? singleConjugation : `<div class="conjVerbTense irregularVerb">${singleConjugation}</div>`);

        builtHtml +=
        `<div class="conj-row"><div class="conjVerbSubjShort">${shortPTsubj}</div><div class="conjVerbTense">${aFormedVerbHtml}${extraParticiple}</div></div>`;
    }

    //Check for no content (if someone turned off display of ALL subjects)
    if (builtHtml !== '') {
        let newDiv = document.createElement("div");
        newDiv.className = "conj-tense-group";
        divWorkArea.appendChild(newDiv);
        newDiv.innerHTML = hdrTense + builtHtml;
    }
} //CreateConjTenseBlock



 /*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Build the Settings-Configuration UI
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
function handleSettingChange(el) {
    const ckSettingType = el.id.slice(2).slice(0,-2); //remove "ck" prefix and numeric ending 
    const ckID = parseInt(el.id.slice(-2)); //next 2 chars for switch

    switch (ckSettingType) {
        case ("VI"):
            vOpts["showVerbInfoOnConj"] = el.checked; //ckVI00 - verb info block
            break;
        case ("SI"):
            vOpts["showSubjInfoOnConj"] = el.checked; //ckSI00 - subj info block
           break;
        case ("QT"):
            vOpts["QshowTense"][ckID] = !(vOpts["QshowTense"][ckID]); //Quiz ckQT##
            break;
        case ("CT"):
            vOpts["CshowTense"][ckID] = !(vOpts["CshowTense"][ckID]); //Conj ckCT##
            break;
        case ("QS"):
            vOpts["QshowSubj"][ckID] = !(vOpts["QshowSubj"][ckID]); //Quiz ckQS##
            break;
        case ("CS"):
            vOpts["CshowSubj"][ckID] = !(vOpts["CshowSubj"][ckID]); //Conj ckCS##
            break;
        case ("FI"): //Filter options
            if (el.id === "slFI00") vOpts["vPop"] = parseInt(el.options[el.selectedIndex].value); //popularity
            if (el.id === "slFI01") vOpts["vTyp"] = parseInt(el.options[el.selectedIndex].value); //Type/Category
            verbsAutoComplete.optionValues = knownVerbs.getUniqueVerbsArray(vOpts);
            break;
       default:
            return; //should not happen
    }
    userStorage.setItem(`${sKey}options`, JSON.stringify(vOpts)); 
}


function SetupConfig() {
    console.log("Settings Config");
    createConfigDiv(divWorkArea);

    //Wire event handler for ALL checkboxes on the Settings page
    const allCkBoxEls = document.getElementsByClassName("ckSet");
    for (let i=0; i < allCkBoxEls.length; i++) {
        allCkBoxEls[i].onclick = function() { handleSettingChange(this); };
    }

    const selVerbPop = document.getElementById("slFI00");
    selVerbPop.onchange = function() { handleSettingChange(this); };

    const selVerbTypes = document.getElementById("slFI01");
    selVerbTypes.onchange = function() { handleSettingChange(this); };
}


function createConfigDiv(divToAppendTo) {
    const sSel = "selected";
    const sCk = "checked";
    let builtHtml = '';

    let newInfoDiv = document.createElement("div");
    divToAppendTo.appendChild(newInfoDiv);

    builtHtml = `
<div class="settings-v-filter">
<div class="filter-hdr">Choose Available Verbs (i.e., Filter the Verbo dropdown choices)</div>
Available verbs include only d.a.o. (depois do Acordo Ortográfico) forms.<br/><br/>
<span class="error">Verbo dropdown</span>: begin typing to display available verbs or press down-arrow to show
the dropdown box<br/>(note: if > 500 available, you must type first character before dropdown appears).<br/>
Enter/Tab will select verb.
<br/><br/>
<hr>
<select id="slFI00">
    <option value="9" ${vOpts["vPop"] === 9 ? sSel : ""}>ALL Verbs</option>
    <option value="1" ${vOpts["vPop"] === 1 ? sSel : ""}>Top-10</option>
    <option value="2" ${vOpts["vPop"] === 2 ? sSel : ""}>Top-25</option>
    <option value="3" ${vOpts["vPop"] === 3 ? sSel : ""}>Top-50</option>
    <option value="4" ${vOpts["vPop"] === 4 ? sSel : ""}>Top-100</option>
    <option value="5" ${vOpts["vPop"] === 5 ? sSel : ""}>Top-250</option>
    <option value="6" ${vOpts["vPop"] === 6 ? sSel : ""}>Top-500</option>
    <option value="7" ${vOpts["vPop"] === 7 ? sSel : ""}>Top-1000</option>
</select>
<label for="slFI00">Verb Popularity (Frequency of use) to include?</label>
<br/>
<hr>
<select id="slFI01">
    <option value="0" ${vOpts["vTyp"] === 0 ? sSel : ""}>ALL Verbs</option>
    <option value="3" ${vOpts["vTyp"] === 3 ? sSel : ""}>Regular in all forms</option>
    <option value="4" ${vOpts["vTyp"] === 4 ? sSel : ""}>Irregular in one or more forms</option>
    <option value="5" ${vOpts["vTyp"] === 5 ? sSel : ""}>Multiple Past-Participles</option>
    <option value="6" ${vOpts["vTyp"] === 6 ? sSel : ""}>IR-ending Stem-Changing Forms</option>
    <option value="7" ${vOpts["vTyp"] === 7 ? sSel : ""}>Defective / Impersonal</option>
    <option value="8" ${vOpts["vTyp"] === 8 ? sSel : ""}>Prefixed: forms align with unprefixed</option>
</select>
<label for="slFI01">Characteristics of Verbs to include?</label>
</div>
<div class="verb-info-group">
<div class="verb-info-hdr">Settings specific to Conjugation Page Format</div>
<input type="checkbox" class="ckSet" id="ckVI00" ${vOpts["showVerbInfoOnConj"] ? sCk : ""}>
<label for="ckVI00">Display Verb Information &mdash; conjugation rules used, verb-popularity, etc?</label>
<br/>
<input type="checkbox" class="ckSet" id="ckSI00" ${vOpts["showSubjInfoOnConj"] ? sCk : ""}>
<label for="ckSI00">Display Subjects of Verbs, Plurality, and Person Information?</label>
</div>
<div class="settings-group-v">
<div class="verb-hdr">Choose which Verb-Tenses to include on Quiz and/or Conjugator Page(s)</div>
<br/>
Quiz <span class="conj-set-ckhdr-inset">Conjugator</span>
<br/>`;

    /*
    ═════════════════════════════════════
    Need to build the next bits in a loop
    ═════════════════════════════════════
    */
    for (let tID = 0; tID <= 22; tID++) {
        builtHtml += `<hr>
        <input type="checkbox" class="ckSet" id="ckQT${tID.toString().padStart(2, "0")}" ${vOpts["QshowTense"][tID] ? sCk : ""}>
        <input type="checkbox" class="ckSet conj-set-ckbox-inset" id="ckCT${tID.toString().padStart(2, "0")}" ${vOpts["CshowTense"][tID] ? sCk : ""}>
        ${vTenses.getFullTenseHeadingTextByID(tID, "S", "")}`;
    }

    //end settings-group-v
    builtHtml += `</div>
    <div class="settings-group-s">
    <div class="subject-hdr">Choose which Verb-Subjects to include on Quiz and/or Conjugator Page(s)</div>`;

    for (let sID = 0; sID <= 6; sID++) {
        builtHtml += `<hr>
        <input type="checkbox" class="ckSet" id="ckQS${sID.toString().padStart(2, "0")}" ${vOpts["QshowSubj"][sID] ? sCk : ""}>
        <input type="checkbox" class="ckSet conj-set-ckbox-inset" id="ckCS${sID.toString().padStart(2, "0")}" ${vOpts["CshowSubj"][sID] ? sCk : ""}>
        ${vSubjects.getFullSubjectDescHtmlByID(sID)}`;
    }

    //end settings-group-s
    builtHtml += `</div>`;

    newInfoDiv.innerHTML = builtHtml;
} //createQuizConfigDiv


/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
Administrative / Troubleshooting Feature : REMOVE FROM PRODUCTION CODE

The code below is for mass data-change-testing of all conjugations after 
rules updates or coding changes that could affect the values generated!

Simply set "analysisMode = false" in the next line and refresh the 
page in the browser.  This could take a few seconds to complete.
The desired portion of the page (all the verbs data) will be obvious
-- copy and paste it into a file like ALL-CONJS.txt or whatever, 
before and after updating conjugations rules or making code changes, 
and use VSS/Git/WinMerge to do a visual diff / compare to validate 
your changes.
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
const analysisMode = false;
if (analysisMode) CreateDataTestingUI(); 

function CreateDataTestingUI() {
    console.log("Data Testing");

    let testLength = 2000;

    divWorkArea.innerText = '';
    let newInfoDiv = document.createElement("div");
    newInfoDiv.className = "dataDump";
    divWorkArea.appendChild(newInfoDiv);

    for (let [verb, vData] of knownVerbs.mKv) {
        writeConjugationData(verb, newInfoDiv);
        if (testLength-- === 0) break;
    }
    newInfoDiv.innerHTML += "<br/>"
}

function writeConjugationData(verb, outputDiv) {
    arrFormedVerbs = formedVerbs.getConjugatedVerbTenses(verb); 
    outputDiv.innerHTML += `<pre>${verb}: ` + JSON.stringify(arrFormedVerbs) + "</pre>";
}