/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
NOTES: see here: https://en.wikipedia.org/wiki/Grammatical_person
The PARTICIPANTS (SUBJECTS) are represented by SIX forms, generally, based on the product of:
    - Number of people encompassed in the Participants of a phrase:
        1) singular / one person, or 2) plurality / multiple people
    - The Person: speaker (first person), the addressee (second person), and others (third person)

Expanded, these PARTICIPANTS ARE:
  First-Person:  I, we  (singular, plural)
  Second-Person: you, you (singular and plural forms of "you")
  Third-Person:  he/she/it/they(single), they(plural)

OR, in Portuguese, these SUBJECT forms could be numbered 1-6 as follows:
    0: SPECIAL CASE -- "All/Tudo"; same conjugated verb applies to all subjects
	1: eu, 
	2: tu, 
	3: você, ele, ela, o senhor, a senhora, a senhorita, a gente
	4: nós (though, in conversational the "a gente" is more likely) 
	5: vós (RARE)
    6: vocês, eles, elas, os senhores, as senhoras, as senhoritas
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
const arrSubjects =
[{
    SubjectID:0,
    Person:0,
    SubjectEN:"All",
    SubjectPT:"todo",
    SubjectDescEN:"All targets",
    SubjectDescPT:"todo",
    Notes:"Verb forms like the Present and Past Pariciples can be applied to ALL subjects\/participants."
}, {
    SubjectID:1,
    Person:1,
    SubjectEN:"I",
    SubjectPT:"eu",
    SubjectDescEN:"I",
    SubjectDescPT:"eu",
    Notes:"I \/ me."
}, {
    SubjectID:2,
    Person:2,
    SubjectEN:"You(1) casual",
    SubjectPT:"tu",
    SubjectDescEN:"You (one person) informal register",
    SubjectDescPT:"tu",
    Notes:"In Portugal, use this informal \/ casual form when directly addressing a person you are familiar amd on casual terms with."
}, {
    SubjectID:3,
    Person:3,
    SubjectEN:"You(1) formal",
    SubjectPT:"você",
    SubjectDescEN:"You (one person) formal register",
    SubjectDescPT:"você, ele, ela, o senhor, a senhora, a gente",
    Notes:"In Portugal, use this formal form when addressing a person you are not familiar with or not on casual terms with, e.g., when interacting with a business contact you just met. The most formal method would be to address someone as \"o senhor ...\" or \"a senhora...\" while using this verb-form."
}, {
    SubjectID:4,
    Person:1,
    SubjectEN:"Us",
    SubjectPT:"nós",
    SubjectDescEN:"Us, we",
    SubjectDescPT:"nós",
    Notes:"Nós will appear more often in written form whereas \"a gente\" is more likely in conversational Portuguese [PT]."
}, {
    SubjectID:5,
    Person:2,
    SubjectEN:"You:RARE-USE",
    SubjectPT:"vós",
    SubjectDescEN:"No good comparison in EN.",
    SubjectDescPT:"vós",
    Notes:"RARELY USED. Mostly encountered used as a singular form to refer to God or someone held in very high esteem. The vós plural form was at one time used for casually addressing multiple people."
}, {
    SubjectID:6,
    Person:3,
    SubjectEN:"You(2+) formal",
    SubjectPT:"vocês",
    SubjectDescEN:"You (a group), they, you men/women",
    SubjectDescPT:"vocês, eles, elas, os senhores, as senhoras",
    Notes:"The most formal way to address a group would be to use the \"os homens\" or \"as mulheres\" while using this verb form."
}];


export function GetPersonDesc(numPersons) {
    let sDesc = '';

    switch (numPersons) {
        case 1:
            sDesc = '1<sup>st</sup> Person';
            break;
        case 2 :
            sDesc = '2<sup>nd</sup> Person';
            break;
        case 3:
            sDesc = '3<sup>rd</sup> Person';
            break;
        default:
            sDesc = 'All (1<sup>st</sup>, 2<sup>nd</sup>, 3<sup>rd</sup>) Persons';
    }

    return sDesc;
}

export function getShortPTSubjLabel(id) {
    return arrSubjects[id]["SubjectPT"];
}

export function getBriefPTSubjectDescByID(id) {
    let subjDescPT = arrSubjects[id]["SubjectDescPT"];

    //If more than 3 subjects, shorten to only 3 max.
    let thirdCommaPos = nthIndex(subjDescPT, ',', 3);
    if (thirdCommaPos !== -1) {
        subjDescPT = subjDescPT.substring(0, thirdCommaPos);
    }
    return subjDescPT;
}

//helper function
function nthIndex(str, pat, n){
  let L = str.length, i= -1;
  while(n-- && i++ < L){
      i= str.indexOf(pat, i);
      if (i < 0) break;
  }
  return i;
}

//Used on Conjugations page and Settings-selection page
export function getFullSubjectDescHtmlByID(id) {
    const vSubEntry = arrSubjects[id];
    const VerbSubjectDesc = `<div class="subject-help"> [PT] ${vSubEntry["SubjectDescPT"]}<br>[EN] ${vSubEntry["SubjectDescEN"]}</div>`;
    const shortPTsubj = this.getBriefPTSubjectDescByID(vSubEntry["SubjectID"]); 
    const personDec = ` <b>${this.GetPersonDesc(vSubEntry["Person"])}</b> &mdash; `;

    let builtHtml =
    `<div><div class="conjVerbSubjShort">${shortPTsubj}</div>${VerbSubjectDesc}</div><div class="subject-note">${personDec}${vSubEntry["Notes"]}</div>`;

    return builtHtml;
}