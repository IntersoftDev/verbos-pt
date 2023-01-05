//The  TenseID aligns with array[elementno-same-as-tense-id] for easier maint (i.e., could be removed)
const arrTenses =
    [ {
        TenseID:0,
        TenseName:"All",
        TenseDescEN:"[checked = ignore individual tense Setting choices below]",
        TenseDescPT:"Todo",
        TenseExEN:"All Tenses",
        TenseExPT:"Todos os Tempos Verbais",
        MaxSubjects:1,
        IsComposite:false
    }, {
        TenseID:1,
        TenseName:"Impersonal Infinitive",
        TenseDescEN:"",
        TenseDescPT:"Infinitivo Impessoal",
        TenseExEN:"To speak",
        TenseExPT:"falar",
        MaxSubjects:1,
        IsComposite:false
    }, {
        TenseID:2,
        TenseName:"Personal Infinitive",
        TenseDescEN:"NON EXISTENT",
        TenseDescPT:"Infinitivo Pessoal",
        TenseExEN:"NON EXISTENT",
        TenseExPT:"eu falar, nós falarmos",
        TenseNotes:"Personalized infinitives in English are formed with the aid of the preposition \"for\"; e.g., she wished for me to speak",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:3,
        TenseName:"Present Participle",
        TenseDescEN:"Gerund",
        TenseDescPT:"Gerúndio",
        TenseExEN:"Speaking",
        TenseExPT:"falando",
        MaxSubjects:1,
        IsComposite:false
    }, {
        TenseID:4,
        TenseName:"Past Participle",
        TenseDescEN:"",
        TenseDescPT:"Particípio Passado",
        TenseExEN:"Spoken",
        TenseExPT:"falado",
        MaxSubjects:1,
        IsComposite:false
    }, {
        TenseID:5,
        TenseName:"Present Indicative",
        TenseDescEN:"Present",
        TenseDescPT:"Presente (do Indicativo)",
        TenseExEN:"I speak",
        TenseExPT:"eu falo",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:6,
        TenseName:"Preterit Indicative",
        TenseDescEN:"Past, or Simple Past",
        TenseDescPT:"Pretérito Perfeito (do Indicativo)",
        TenseExEN:"I spoke",
        TenseExPT:"eu falei",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:7,
        TenseName:"Imperfect Indicative",
        TenseDescEN:"Imperfect",
        TenseDescPT:"Pretérito Imperfeito (do Indicativo)",
        TenseExEN:"I was speaking; I used to speak",
        TenseExPT:"eu falava",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:8,
        TenseName:"Pluperfect Indicative",
        TenseDescEN:"Pluperfect, or Simple Pluperfect",
        TenseDescPT:"Pretérito mais-que-perfeito Simples (do Indicativo)",
        TenseExEN:"I had spoken",
        TenseExPT:"eu falara",
        TenseNotes:"Mainly a literary form. I had spoken (without using tinha\/etc like past-perfect\/pluperfect-indicative",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:9,
        TenseName:"Future Indicative",
        TenseDescEN:"Future (of the Present)",
        TenseDescPT:"Futuro (do Presente \/ Indicativo)",
        TenseExEN:"I will speak; I shall speak; I am going to speak",
        TenseExPT:"eu falarei",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:10,
        TenseName:"Conditional",
        TenseDescEN:"Future of the Past",
        TenseDescPT:"Conditional (Simples) \/ Futuro do Pretérito",
        TenseExEN:"I would speak; I should speak",
        TenseExPT:"eu falaria",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:11,
        TenseName:"Present Subjunctive",
        TenseDescEN:"Subjunctive",
        TenseDescPT:"Presente (do Conjuntivo \/ Subjuntivo)",
        TenseExEN:"I may speak",
        TenseExPT:"que eu fale",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:12,
        TenseName:"Imperfect Subjunctive",
        TenseDescEN:"",
        TenseDescPT:"Imperfeito \/ Pretérito Imperfeito (do Conjuntivo \/ Subjuntivo)",
        TenseExEN:"I might speak; If I were to speak",
        TenseExPT:"se eu falasse",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:13,
        TenseName:"Future Subjunctive",
        TenseDescEN:"NO DIRECT EQUIVALENT",
        TenseDescPT:"Futuro (do Conjuntivo \/ Subjuntivo)",
        TenseExEN:"If I were to speak; If I should speak",
        TenseExPT:"quando eu falar",
        TenseNotes:"No definite form in english; formed in other ways",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:14,
        TenseName:"Imperative",
        TenseDescEN:"",
        TenseDescPT:"(Afirmativo do) Imperativo",
        TenseExEN:"Speak! (speak, you)",
        TenseExPT:"Fale!",
        TenseNotes:"DERIVED: The affirmative imperative for second person pronouns tu and vós is obtained from the present indicative (vós form requires deletion of the final -s too). I some cases, an accent mark must be added to the vowel which precedes it. For other persons, the imperative is obtained from the present subjunctive.",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:15,
        TenseName:"Negative Imperative",
        TenseDescEN:"",
        TenseDescPT:"(Negativo do) Imperativo",
        TenseExEN:"Do not Speak!",
        TenseExPT:"Não fale!",
        TenseNotes:"DERIVED: The negative imperative is obtained directly from the present subjunctive.",
        MaxSubjects:6,
        IsComposite:false
    }, {
        TenseID:16,
        TenseName:"Present Perfect Indicative",
        TenseDescEN:"",
        TenseDescPT:"Pretérito Indefinido \/ Pretérito Perfeito Composto \/ Presente Composto (do Indicativo)",
        TenseExEN:"I have spoken; I have been speaking",
        TenseExPT:"eu tenho falado",
        TenseNotes:"COMPOSITE form derived from: \"[Present form of Ter] [PastParticiple]\". E.g., Fazer: eu tenho feito.  Use when describing repetive or continuous past actions that carry into the present and likely into the future.",
        MaxSubjects:6,
        IsComposite:true
    }, {
        TenseID:17,
        TenseName:"Past Perfect Indicative",
        TenseDescEN:"Pluperfect Indicative",
        TenseDescPT:"Pretérito Mais-que-Perfeito Composto (do Indicativo)",
        TenseExEN:"I had spoken",
        TenseExPT:"eu tinha falado",
        TenseNotes:"COMPOSITE form derived from: \"[Imperfect (Indicative) form of Ter] [PastParticiple]\". E.g., Fazer: eu tinho feito.",
        MaxSubjects:6,
        IsComposite:true
    }, {
        TenseID:18,
        TenseName:"Future Perfect Indicative",
        TenseDescEN:"",
        TenseDescPT:"Futuro Perfeito Composto (do Indicativo)",
        TenseExEN:"I (will \/ shall) have spoken",
        TenseExPT:"eu terei falado",
        TenseNotes:"COMPOSITE form derived from: \"[Future form of Ter] [PastParticiple]\". E.g., Fazer: eu terei feito",
        MaxSubjects:6,
        IsComposite:true
    }, {
        TenseID:19,
        TenseName:"Conditional Perfect",
        TenseDescEN:"",
        TenseDescPT:"Condicional Perfeito \/ Futuro Composto (do Pretérito)",
        TenseExEN:"I (would \/ should) have spoken",
        TenseExPT:"eu teria falado",
        TenseNotes:"COMPOSITE form derived from: \"[Conditional form of Ter] [PastParticiple]\". E.g., Fazer: eu teria feito",
        MaxSubjects:6,
        IsComposite:true
    }, {
        TenseID:20,
        TenseName:"Present Perfect Subjunctive",
        TenseDescEN:"",
        TenseDescPT:"Pretérito Indefinido \/ Pretérito Perfeito \/ Presente Composto (do Conjuntivo \/ Subjuntivo)",
        TenseExEN:"I may have spoken",
        TenseExPT:"eu tenha falado",
        TenseNotes:"COMPOSITE form derived from: \"[Present Subjunctive (i.e., Subjunctive) form of Ter] [PastParticiple]\". E.g., Fazer: eu tenha feito",
        MaxSubjects:6,
        IsComposite:true
    }, {
        TenseID:21,
        TenseName:"Past Perfect Subjunctive",
        TenseDescEN:"Pluperfect Subjunctive",
        TenseDescPT:"Pretérito mais-que-perfeito Composto (do Conjuntivo \/ Subjuntivo)",
        TenseExEN:"I might have spoken",
        TenseExPT:"eu tivesse falado",
        TenseNotes:"COMPOSITE form derived from: \"[Imperfect Subjunctive form of Ter] [PastParticiple]\". E.g., Fazer: eu tivesse feito",
        MaxSubjects:6,
        IsComposite:true
    }, {
        TenseID:22,
        TenseName:"Future Perfect Subjunctive",
        TenseDescEN:"",
        TenseDescPT:"Futuro Perfeito Composto (do Conjuntivo \/ Subjuntivo)",
        TenseExEN:"If I were to have spoken",
        TenseExPT:"eu tiver falado",
        TenseNotes:"COMPOSITE form derived from: \"[Future Subjunctive form of Ter] [PastParticiple]\". E.g., Fazer: eu tiver feito.  No definite form in english; formed in other ways",
        MaxSubjects:6,
        IsComposite:true
    }];


export function getTenseByID(id) {
  return arrTenses[id];
}

export function getMaxSubjCount(id) {
    return arrTenses[id]["MaxSubjects"];
}

//whatHeader (string) = Q, C, S (Quiz, Conjugator, Settings respectively)
export function getFullTenseHeadingTextByID(id, whatHeader, verbExample) {
    const TenseData = getTenseByID(id);
    
    let TenseNameEN = TenseData["TenseName"];
    if (TenseData["TenseDescEN"] !== '') {
        TenseNameEN = TenseNameEN + ' / ' + TenseData["TenseDescEN"];
    }

    let hdrTense = `PT: ${TenseData["TenseDescPT"]}<br>EN: ${TenseNameEN}`;

    if (whatHeader !== "S") {
        //Quiz and Conj use these formats:
        const conjStyle = (((id === 14) || (id === 15)) ? "ConjImperative" : (TenseData["IsComposite"]) ? 'ConjComposto' : '');
        hdrTense = `<h2 class="${conjStyle}">${hdrTense}</h2>`;
    }  else {
        let stylCor = 'ConjBase'
        switch (true) {
            case ((id === 14) || (id === 15)) : stylCor = 'ConjImperative'; break;
            case (id > 15) : stylCor = 'ConjComposto'; break;
        }
        hdrTense = `<span class=${stylCor}>${hdrTense}</span>`;
    }

    let tenseExampleText = `<span class="tense-example">Tense example: [PT] ${TenseData["TenseExPT"]} &mdash; [EN] ${TenseData["TenseExEN"]}</span>`;

    switch (whatHeader) {
        case ("Q"):
            hdrTense += `<div class="tense-instruct">Conjugate "<b>${verbExample}</b>" <span class="success"> for each subject below</span>. 
            ${tenseExampleText}</div>`;
            break;
        case ("C"):
            hdrTense += `<div class="tense-example">Conjugated: "<b>${verbExample}</b>". &nbsp;&nbsp;` + tenseExampleText + '</div>';
           break;
        default:
            hdrTense = `<div class="conj-set-text-inset">${hdrTense}<br/>${tenseExampleText}</div><br>`;
    }

    return hdrTense;
}