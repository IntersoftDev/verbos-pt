//Copyright © Michael Eberhart (suretalent.blogspot.com), 2020, All Rights Reserved
import * as knownVerbs  from './known-verbs.js';
import * as vTenses     from './verb-tenses.js';

/*============================================================================================
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
var mapRules = new Map();
mapRules.set("ar",[,,["ar","ares","ar","armos","ardes","arem"],["ando"],["ado"],["o","as","a","amos","ais","am"],["ei","aste","ou","ámos","astes","aram"],["ava","avas","ava","ávamos","áveis","avam"],["ara","aras","ara","áramos","áreis","aram"],["arei","arás","ará","aremos","areis","arão"],["aria","arias","aria","aríamos","aríeis","ariam"],["e","es","e","emos","eis","em"],["asse","asses","asse","ássemos","ásseis","assem"],["ar","ares","ar","armos","ardes","arem"]]);
mapRules.set("er",[,,["er","eres","er","ermos","erdes","erem"],["endo"],["ido"],["o","es","e","emos","eis","em"],["i","este","eu","emos","estes","eram"],["ia","ias","ia","íamos","íeis","iam"],["era","eras","era","êramos","êreis","eram"],["erei","erás","erá","eremos","ereis","erão"],["eria","erias","eria","eríamos","eríeis","eriam"],["a","as","a","amos","ais","am"],["esse","esses","esse","êssemos","êsseis","essem"],["er","eres","er","ermos","erdes","erem"]]);
mapRules.set("ir",[,,["ir","ires","ir","irmos","irdes","irem"],["indo"],["ido"],["o","es","e","imos","is","em"],["i","iste","iu","imos","istes","iram"],["ia","ias","ia","íamos","íeis","iam"],["ira","iras","ira","íramos","íreis","iram"],["irei","irás","irá","iremos","ireis","irão"],["iria","irias","iria","iríamos","iríeis","iriam"],["a","as","a","amos","ais","am"],["isse","isses","isse","íssemos","ísseis","issem"],["ir","ires","ir","irmos","irdes","irem"]]);
mapRules.set("or",[,,["or","ores","or","ormos","ordes","orem"],["ondo"],["osto"],["onho","ões","õe","omos","ondes","õem"],["us","useste","ôs","usemos","usestes","useram"],["unha","unhas","unha","únhamos","únheis","unham"],["usera","useras","usera","uséramos","uséreis","useram"],["orei","orás","orá","oremos","oreis","orão"],["oria","orias","oria","oríamos","oríeis","oriam"],["onha","onhas","onha","onhamos","onhais","onham"],["usesse","usesses","usesse","uséssemos","usésseis","usessem"],["user","useres","user","usermos","userdes","userem"]]);
mapRules.set("air",["ir",,[null,"aíres",null,null,null,"aírem"],[],["aído"],["aio","ais","ai","aímos","aís",null],["aí","aíste",null,"aímos","aístes","aíram"],["aía","aías","aía",null,null,"aíam"],["aíra","aíras","aíra",null,null,"aíram"],[],[],["aia","aias","aia","aiamos","aiais","aiam"],["aísse","aísses","aísse",null,null,"aíssem"],[null,"aíres",null,null,null,"aírem"]]);
mapRules.set("car",["ar",,[],[],[],[],["quei",null,null,null,null,null],[],[],[],[],["que","ques","que","quemos","queis","quem"],[],[]]);
mapRules.set("çar",["ar",,[],[],[],[],["cei",null,null,null,null,null],[],[],[],[],["ce","ces","ce","cemos","ceis","cem"],[],[]]);
mapRules.set("cer",["er",,[],[],[],["ço",null,null,null,null,null],[],[],[],[],[],["ça","ças","ça","çamos","çais","çam"],[],[]]);
mapRules.set("ear",["ar",,[],[],[],["eio","eias","eia",null,null,"eiam"],[],[],[],[],[],["eie","eies","eie",null,null,"eiem"],[],[]]);
mapRules.set("gar",["ar",,[],[],[],[],["guei",null,null,null,null,null],[],[],[],[],["gue","gues","gue","guemos","gueis","guem"],[],[]]);
mapRules.set("ger",["er",,[],[],[],["jo",null,null,null,null,null],[],[],[],[],[],["ja","jas","ja","jamos","jais","jam"],[],[]]);
mapRules.set("gir",["ir",,[],[],[],["jo",null,null,null,null,null],[],[],[],[],[],["ja","jas","ja","jamos","jais","jam"],[],[]]);
mapRules.set("oer",["er",,[],[],["oído"],[null,"óis","ói",null,null,null],["oí",null,null,null,null,null],["oía","oías","oía",null,null,"oíam"],[],[],[],[],[],[]]);
mapRules.set("uir",["ir",,[null,"uíres",null,null,null,"uírem"],[],["uído"],[null,"uis","ui","uímos","uís",null],["uí","uíste",null,"uímos","uístes","uíram"],["uía","uías","uía",null,null,"uíam"],["uíra","uíras","uíra",null,null,"uíram"],[],[],[],["uísse","uísses","uísse",null,null,"uíssem"],[null,"uíres",null,null,null,"uírem"]]);
mapRules.set("zir",["ir",,[],[],[],[null,null,"z",null,null,null],[],[],[],[],[],[],[],[],"zir-ending verbs have two valid (Afirmativo do) Imperativo tu-forms; to form the second one (not shown) simply append the letter e"]);
mapRules.set("enir",["ir",,[],[],[],["ino","ines","ine",null,null,"inem"],[],[],[],[],[],["ina","inas","ina","inamos","inais","inam"],[],[]]);
mapRules.set("guer",["er",,[],[],[],["go",null,null,null,null,null],[],[],[],[],[],["ga","gas","ga","gamos","gais","gam"],[],[]]);
mapRules.set("guir",["ir",,[],[],[],["go",null,null,null,null,null],[],[],[],[],[],["ga","gas","ga","gamos","gais","gam"],[],[]]);
mapRules.set("ibir",["ir",,[],[],[],["íbo","íbes","íbe",null,null,"íbem"],[],[],[],[],[],["íba","íbas","íba",null,null,"íbam"],[],[]]);
mapRules.set("unir",["ir",,[],[],[],["úno","únes","úne",null,null,null],[],[],[],[],[],["úna","únas","úna",null,null,null],[],[]]);
mapRules.set("valer",["er",,[],[],[],["valho",null,null,null,null,null],[],[],[],[],[],["valha","valhas","valha","valhamos","valhais","valham"],[],[]]);
mapRules.set("struir",["ir",,[null,"struíres",null,null,null,"struírem"],[],["struído"],[null,"stróis","strói","struímos","struís","stroem"],["struí","struíste",null,"struímos","struístes","struíram"],["struía","struías","struía",null,null,"struíam"],["struíra","struíras","struíra",null,null,"struíram"],[],[],[],["struísse","struísses","struísse",null,null,"struíssem"],[null,"struíres",null,null,null,"struírem"]]);
mapRules.set(".abrir",["ir",,[],[],["aberto"],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".acontecer",["cer",,["-","-",null,"-","-",null],[],[],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null],["-","-",null,"-","-",null]]);
mapRules.set(".amanhecer",["cer",,["-","-",null,"-","-","-"],[],[],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"]]);
mapRules.set(".anoitecer",["cer",,["-","-",null,"-","-","-"],[],[],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"]]);
mapRules.set(".caber",["er",,[],[],[],["caibo",null,null,null,null,null],["coube","coubeste","coube","coubemos","coubestes","couberam"],["coubera","couberas","coubera","coubéramos","coubéreis","couberam"],[],[],[],["caiba","caibas","caiba","caibamos","caibais","caibam"],["coubesse","coubesses","coubesse","coubéssemos","coubésseis","coubessem"],["couber","couberes","couber","coubermos","couberdes","couberem"]]);
mapRules.set(".chover",["er",,["-","-",null,"-","-","-"],[],[],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"],["-","-",null,"-","-","-"]]);
mapRules.set(".cobrir",["ir",,[],[],["coberto"],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".crer",["er",,[],[],[],["creio","crês","crê",null,"credes","creem"],[],[],[],[],[],["creia","creias","creia","creiamos","creias","creiam"],[],[],"the verb ler is formed similarly"]);
mapRules.set(".dar",["ar",,[],[],[],["dou","dás","dá","damos","dais","dão"],["dei","deste","deu","demos","destes","deram"],[],["dera","deras","dera","déramos","déreis","deram"],[],[],["dê","dês","dê","dêmos","deis","dêem"],["desse","desses","desse","déssemos","désseis","dessem"],["der","deres","der","dermos","derdes","derem"]]);
mapRules.set(".dizer",["er",,[],[],["dito"],["digo",null,"diz",null,null,null],["disse","disseste","disse","dissemos","dissestes","disseram"],[],["dissera","disseras","dissera","disséramos","disséreis","disseram"],["direi","dirás","dirá","diremos","direis","dirão"],["diria","dirias","diria","diríamos","diríeis","diriam"],["diga","digas","diga","digamos","digais","digam"],["dissesse","dissesses","dissesse","disséssemos","dissésseis","dissessem"],["disser","disseres","disser","dissermos","disserdes","disserem"]]);
mapRules.set(".escrever",["er",,[],[],["escrito"],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".estar",["ar",,[],[],[],["estou","estás","está",null,null,"estão"],["estive","estiveste","esteve","estivemos","estivestes","estiveram"],[],["estivera","estiveras","estivera","estivéramos","estivéreis","estiveram"],[],[],["esteja","estejas","esteja","estejamos","estejais","estejam"],["estivesse","estivesses","estivesse","estivéssemos","estivésseis","estivessem"],["estiver","estiveres","estiver","estivermos","estiverdes","estiverem"]]);
mapRules.set(".exibir",["ir",,[],[],[],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".fazer",["er",,[],[],["feito"],["faço",null,"faz",null,null,null],["fiz","fizeste","fez","fizemos","fizestes","fizeram"],["fazia","fazias","fazia","fazíamos","fazíeis","faziam"],["fizera","fizeras","fizera","fizéramos","fizéreis","fizeram"],["farei","farás","fará","faremos","fareis","farão"],["faria","farias","faria","faríamos","faríeis","fariam"],["faça","faças","faça","façamos","façais","façam"],["fizesse","fizesses","fizesse","fizéssemos","fizésseis","fizessem"],["fizer","fizeres","fizer","fizermos","fizerdes","fizerem"]]);
mapRules.set(".ganhar",["ar",,[],[],["ganho"],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".gastar",["ar",,[],[],["gasto"],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".haver",["er",,[],[],[],["hei","hás","há",null,null,"hão"],["houve","houveste","houve","houvemos","houvestes","houveram"],[],["houvera","houveras","houvera","houvéramos","houvéreis","houveram"],[],[],["haja","hajas","haja","hajamos","hajais","hajam"],["houvesse","houvesses","houvesse","houvéssemos","houvésseis","houvessem"],["houver","houveres","houver","houvermos","houverdes","houverem"]]);
mapRules.set(".ir",["ir",,[],[],[],["vou","vais","vai","vamos","ides","vão"],["fui","foste","foi","fomos","fostes","foram"],[],["fora","foras","fora","fôramos","fôreis","foram"],[],[],["vá","vás","vá","vamos","vades","vão"],["fosse","fosses","fosse","fôssemos","fôsseis","fossem"],["for","fores","for","formos","fordes","forem"]]);
mapRules.set(".jazer",["er",,[],[],[],[null,null,"jaz",null,null,null],[],[],[],[],[],[],[],[],"jazer has two valid (Afirmativo do) Imperativo tu-forms; to form the second one (not shown) simply append the letter e"]);
mapRules.set(".ler",["er",,[],[],[],["leio","lês","lê",null,"ledes","leem"],[],[],[],[],[],["leia","leias","leia","leiamos","leias","leiam"],[],[],"the verb crer is formed similarly"]);
mapRules.set(".manter",[".ter",,[],[],[],[null,"manténs","mantém",null,null,null],[],[],[],[],[],[],[],[]]);
mapRules.set(".medir",["ir",,[],[],[],["meço",null,null,null,null,null],[],[],[],[],[],["meça","meças","meça","meçamos","meçais","meçam"],[],[]]);
mapRules.set(".odiar",["ar",,[],[],[],["odeio","odeias","odeia",null,null,"odeiam"],[],[],[],[],[],["odeie","odeies","odeie",null,null,"odeiem"],[],[]]);
mapRules.set(".ouvir",["ir",,[],[],[],["ouço",null,null,null,null,null],[],[],[],[],[],["ouça","ouças","ouça","ouçamos","ouçais","ouçam"],[],[],"alternative valid forms exist: present tense (eu = oiço); present subjunctive tenses (oiça, oiças, oiça, oiçamos, oiçais, oiçam)"]);
mapRules.set(".pagar",["gar",,[],[],["pago"],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".pedir",["ir",,[],[],[],["peço",null,null,null,null,null],[],[],[],[],[],["peça","peças","peça","peçamos","peçais","peçam"],[],[]]);
mapRules.set(".perder",["er",,[],[],[],["perco",null,null,null,null,null],[],[],[],[],[],["perca","percas","perca","percamos","percais","percam"],[],[]]);
mapRules.set(".poder",["er",,[],[],[],["posso",null,null,null,null,null],["pude","pudeste","pôde","pudemos","pudestes","puderam"],[],["pudera","puderas","pudera","pudéramos","pudéreis","puderam"],[],[],["possa","possas","possa","possamos","possais","possam"],["pudesse","pudesses","pudesse","pudéssemos","pudésseis","pudessem"],["puder","puderes","puder","pudermos","puderdes","puderem"]]);
mapRules.set(".pôr",["or",,["pôr",null,"pôr",null,null,null],[],[],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".querer",["er",,[],[],[],[null,null,"quer",null,null,null],["quis","quiseste","quis","quisemos","quisestes","quiseram"],[],["quisera","quiseras","quisera","quiséramos","quiséreis","quiseram"],[],[],["queira","queiras","queira","queiramos","queirais","queiram"],["quisesse","quisesses","quisesse","quiséssemos","quisésseis","quisessem"],["quiser","quiseres","quiser","quisermos","quiserdes","quiserem"]]);
mapRules.set(".requerer",["er",,[],[],[],["requeiro",null,"requer",null,null,null],[],[],[],[],[],["requeira","requeiras","requeira","requeiramos","requeirais","requeiram"],[],[]]);
mapRules.set(".reunir",["ir",,[],[],[],["reúno","reúnes","reúne",null,null,"reúnem"],[],[],[],[],[],["reúna","reúnas","reúna",null,null,"reúnam"],[],[]]);
mapRules.set(".rir",["ir",,[],[],[],["rio","ris","ri",null,"rides","riem"],[],[],[],[],[],["ria","rias","ria","riamos","riais","riam"],[],[]]);
mapRules.set(".saber",["er",,[],[],[],["sei",null,null,null,null,null],["soube","soubeste","soube","soubemos","soubestes","souberam"],[],["soubera","souberas","soubera","soubéramos","soubéreis","souberam"],[],[],["saiba","saibas","saiba","saibamos","saibais","saibam"],["soubesse","soubesses","soubesse","soubéssemos","soubésseis","soubessem"],["souber","souberes","souber","soubermos","souberdes","souberem"]]);
mapRules.set(".saudar",["ar",,[],[],[],["saúdo","saúdas","saúda",null,null,"saúdam"],[],[],[],[],[],["saúde","saúdes","saúde",null,null,"saúdem"],[],[]]);
mapRules.set(".ser",["er",,[],[],[],["sou","és","é","somos","sois","são"],["fui","foste","foi","fomos","fostes","foram"],["era","eras","era","éramos","éreis","eram"],["fora","foras","fora","fôramos","fôreis","foram"],[],[],["seja","sejas","seja","sejamos","sejais","sejam"],["fosse","fosses","fosse","fôssemos","fôsseis","fossem"],["for","fores","for","formos","fordes","forem"]]);
mapRules.set(".ter",["er",,[],[],[],["tenho","tens","tem",null,"tendes","têm"],["tive","tiveste","teve","tivemos","tiveste","tiveram"],["tinha","tinhas","tinha","tínhamos","tínheis","tinham"],["tivera","tiveras","tivera","tivéramos","tivéreis","tiveram"],[],[],["tenha","tenhas","tenha","tenhamos","tenhais","tenham"],["tivesse","tivesses","tivesse","tivéssemos","tivésseis","tivessem"],["tiver","tiveres","tiver","tivermos","tiverdes","tiverem"]]);
mapRules.set(".trazer",["er",,[],[],[],["trago",null,"traz",null,null,null],["trouxe","trouxeste","trouxe","trouxemos","trouxestes","trouxeram"],[],["trouxera","trouxeras","trouxera","trouxéramos","trouxéreis","trouxeram"],["trarei","trarás","trará","traremos","trareis","trarão"],["traria","trarias","traria","traríamos","traríeis","trariam"],["traga","tragas","traga","tragamos","tragais","tragam"],["trouxesse","trouxesses","trouxesse","trouxéssemos","trouxésseis","trouxessem"],["trouxer","trouxeres","trouxer","trouxermos","trouxerdes","trouxerem"]]);
mapRules.set(".unir",["ir",,[],[],[],[],[],[],[],[],[],[],[],[]]);
mapRules.set(".ver",["er",,[],[],["visto"],["vejo","vês","vê",null,"vedes","veem"],[null,"viste","viu","vimos","vistes","viram"],[],["vira","viras","vira","víramos","víreis","viram"],[],[],["veja","vejas","veja","vejamos","vejais","vejam"],["visse","visses","visse","víssemos","vísseis","vissem"],["vir","vires","vir","virmos","virdes","virem"]]);
mapRules.set(".vir",["ir",,[],[],["vindo"],["venho","vens","vem","vimos","vindes","vêm"],["vim","vieste","veio","viemos","vieste","vieram"],["vinha","vinhas","vinha","vínhamos","vínheis","vinham"],["viera","vieras","viera","viéramos","viéreis","vieram"],[],[],["venha","venhas","venha","venhamos","venhais","venham"],["viesse","viesses","viesse","viéssemos","viésseis","viessem"],["vier","vieres","vier","viermos","vierdes","vierem"]]);

/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
PASTE G-SHEETS-GENERATED-RULES ABOVE HERE; CUSTOM CODE BELOW.
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
//Clone this to make new instances in proper format! (using JSON parse/stringify)
let arrEmptyConjs = [
    [], //0 = Store the first NON-PREFIX rule-match value here (used in UI)
    [null], //1 = Infinitive (Impersonal Infinitive)
    [null,null,null,null,null,null], //2 = Infinitive (Personal Infinitive)
    [null], //3,4 =participles
    [null], 
    [null,null,null,null,null,null], //5 = start base forms
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null], //13 = end of base forms
    [null,null,null,null,null,null], //14 = Normal Imperative
    [null,null,null,null,null,null], //15 = Negative Imperative
    [null,null,null,null,null,null], //16 = start of compound TER+participle forms
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null],
    [null,null,null,null,null,null], 
    [null,null,null,null,null,null], 
    [null,null,null,null,null,null]  //22 = end of compound forms
];

 //TER Conjugations : needed by all others, load must be executed before all other Conjugations!
let arrTerConjs = [];

export function loadTerConjucations() {
    arrTerConjs = getConjugatedVerbTenses("ter");
}

/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
All the heavy-lifting for determining built conjugations per verb-tense/subject.
Create most-specific conjugations first, and move toward most-generic (i.e., from
    overridden rules to standard rules for ar/er/ir/or verb endings). See code comments.

RETURNS:
New Array of VerbTenses with all subjects fully conjugated per mapRules entries.
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
export function getConjugatedVerbTenses(VerboInfinitivo) {
    let arrConjs = JSON.parse(JSON.stringify(arrEmptyConjs)); //Create a new instance for return to caller.
    let regularityIndicator = '*'; //* = regular, period indicates irregular


    /*═══════════════════════════════════════════════════════════════════════════════════════
    (VerbTenseID = 1) Impersonal Infinitive is same for all Subjects;
    ═══════════════════════════════════════════════════════════════════════════════════════*/
    arrConjs[1][0] = `*${VerboInfinitivo}`;
    
    let kvEntry = knownVerbs.mKv.get(VerboInfinitivo);
    let prefix  = knownVerbs.getPrefix(VerboInfinitivo);

    //Prefixed : point to the non-prefixed verb instead. We'll add the prefix back last
    if (prefix !== '') {
        VerboInfinitivo = VerboInfinitivo.slice(prefix.length);
        kvEntry = knownVerbs.mKv.get(VerboInfinitivo);
    }

    let IRstemPos = knownVerbs.getIRstemPos(VerboInfinitivo);
    let ruleToUse = kvEntry["R"]; //String containing verb-suffix that matches a rule
    arrConjs[0] = ruleToUse; //Track matched-endings so UI can show what matching rule(s)/suffix were used.
    let ruleEntry = mapRules.get(ruleToUse); 

    let conjEnding = "";
    let isInnermostRule = false;

    //Iterate from most specific (Irregular) VerbTense building rules to innermost/standard-form rules.
    while (!isInnermostRule) {

        let isReplaceEntireForm = (ruleToUse.charAt(0) === "." ? true : false);
        let sliceRuleLenThisLevel = -1 * (isInnermostRule ? 2 : ruleToUse.length); 

        /*═══════════════════════════════════════════════════════════════════════════════════════
        Cycle through the Rules for each VerbTense (2-13)
        After reaching/processing innermost level (AR/ER/IR/OR), ALL tenses/subjects will have values.
        Working from highest-level rules towards the standard/innermost rules, only need to 
        computer a conjugation when a previously determined value 
        (i.e., "overrides" that make a form "irregular") have not yet filled in that rule.
        ═══════════════════════════════════════════════════════════════════════════════════════*/
        for (let tenseID = 2; tenseID <= 13; tenseID++) {
            let maxSubjects = vTenses.getMaxSubjCount(tenseID);

            for (let subjectID = 0; subjectID < maxSubjects; subjectID++) {

                //skip null entries (since prior, deeper-nested-rule-defaults reign supreme)
                if ( (ruleEntry[tenseID]?.[subjectID] === undefined)
                    || (arrConjs[tenseID][subjectID] !== null)) continue;
               
                //any specified rule for this tense/subject at this level?
                conjEnding = ruleEntry[tenseID]?.[subjectID]?.toString();
                if (conjEnding === undefined) continue;

                //Handle what are known as "defective" verbs where not all tenses are conjugated (flagged as "-" in sheet)
                if (conjEnding === '-') {
                    arrConjs[tenseID][subjectID] = '-❌';
                    continue;
                }

                regularityIndicator = (ruleToUse.length === 2 ? '*' : '.' ); 
                if (isReplaceEntireForm) {
                    arrConjs[tenseID][subjectID] = regularityIndicator + prefix + conjEnding;
                } else {
                    //Present (5) or Subjunctive (11) are the only potential IR-stem-change-possible verb forms
                    // if ((((tenseID === 5) && (subjectID === 0)) || (tenseID === 11)) && (IRstemPos !== null)) {
                    if (((tenseID === 5) || (tenseID === 11)) && (IRstemPos !== null)) {
                        let OrigStemVowel = VerboInfinitivo.charAt(IRstemPos -1); //x-form StemPos to 0-indexed (vs 1-indexed spreadsheet value)
                        let NewStemVowel  = getIRChange(tenseID, subjectID, OrigStemVowel);
                        if (NewStemVowel !== OrigStemVowel) { regularityIndicator = '.';} //flag stem-changers as irregular

                        let ChangedVerboInf = VerboInfinitivo.slice(0,IRstemPos -1) + NewStemVowel + VerboInfinitivo.slice(IRstemPos);
                        arrConjs[tenseID][subjectID] = regularityIndicator + prefix + ChangedVerboInf.slice(0, sliceRuleLenThisLevel) + conjEnding;
                    } else {
                        arrConjs[tenseID][subjectID] = regularityIndicator + prefix + VerboInfinitivo.slice(0, sliceRuleLenThisLevel) + conjEnding;
                    }
                }

            } //for Subjects
        } //for VerbTenses 

        //Are there any more nested rules to process? (?? turns undefined empty array position to '')
        ruleToUse = ruleEntry[0]?.toString() ?? ''; //Inherited rule, if any
        if (ruleToUse.length !== 0) {
            ruleEntry = mapRules.get(ruleToUse);
            arrConjs[0] += (ruleToUse.length === 2 ? '' : `, ${ruleToUse}`);
        } else {
            isInnermostRule = true; //Must be AR/ER/IR/OR 
        }
    } //while


    /*═══════════════════════════════════════════════════════════════════════════════════════
    VERY SPECIFIC PREFIXED-VERBS OVERRIDES -- where, the verb is NEARLY identical in all 
    forms, but perhaps varies by something as small as an accent-mark/change.
    We know anything at this level is a full replacement of any other previously built value
    and any prefixed-verb-specific-rule must be in form ".prefixedverb".
    NOTE: remember, we stripped prefix from VerboInfinitivo earlier; add it back.
    ═══════════════════════════════════════════════════════════════════════════════════════*/
    if ((prefix !== '') && (mapRules.has('.' + prefix + VerboInfinitivo))) {
        ruleEntry = mapRules.get('.' + prefix + VerboInfinitivo);
        for (let tenseID = 2; tenseID <= 13; tenseID++) {
            let maxSubjects = vTenses.getMaxSubjCount(tenseID);
            for (let subjectID = 0; subjectID < maxSubjects; subjectID++) {
                if (ruleEntry[tenseID]?.[subjectID] === undefined) continue; 
                
                //any specified rule for this tense/subject at this level? 
                conjEnding = ruleEntry[tenseID]?.[subjectID]?.toString();
                if (conjEnding !== undefined) {
                    //"ending" must be entire word for any of these! prefix with irreg indicator.
                    arrConjs[tenseID][subjectID] = "." + conjEnding;
                }  
            }
        }    
    } 

    /*═══════════════════════════════════════════════════════════════════════════════════════
    More "fixups" that would otherwise require a lot of extra entries in spreadsheet.
    All of these have present-tense alterations to the conjugations, where they use the same 
    conj as (unprefixed) TER/VIR but with ACCENT-DIFFERENCE for the tu/ele positions 
    (where the last e becomes accented é).
    ═══════════════════════════════════════════════════════════════════════════════════════*/
    switch (prefix + VerboInfinitivo) {
        case "conter":
        case "deter":
        case "entreter":
        case "obter": 
        case "reter": 
        case "suster":
        case "convir":
        case "intervir":
        case "provir":
            const tuForm = arrConjs[5][1].toString(); //vens/tens ending now; => véns/téns
            const tuTgtPos = tuForm.length - 3; //len is 1-indexed
            const eleForm = arrConjs[5][2].toString(); //tem/vem now => tém/vém
            const eleTgtPos = eleForm.length - 2;

            arrConjs[5][1] = tuForm.substring(0, tuTgtPos) + "é" + tuForm.substring(tuTgtPos + 1);
            arrConjs[5][2] = eleForm.substring(0, eleTgtPos) + "é" + eleForm.substring(eleTgtPos + 1);
            arrConjs[0] += `; ${prefix + VerboInfinitivo} (for present tense tu/ele accents)`;
    }

    /*═══════════════════════════════════════════════════════════════════════════════════════
	PROCESS THE IMPERATIVE FORMS (14 = Normal, 15 = Negative Imperative)
	Neither tense has eu(subject)-form, thus use minus-sign to indicate missing.

    These are built from other forms determined earlier for this verb.
    NOTE: CARRY THE REGULARITY-INDICATOR OF THE SOURCE-VERB for these forms.

    There exist a FEW ODDBALLs for which fixups need to occur; handle here vs. sheet column.
    (TODO: IF enough exist to justify move to sheet, do so)
    ═══════════════════════════════════════════════════════════════════════════════════════*/
    switch (true) {
        case (VerboInfinitivo === 'ser') :
            arrConjs[14][1] = '.sê';
            arrConjs[14][4] = '.sede';
            break; 
    }

    arrConjs[14][0] = '-❌';
    arrConjs[14][1] = (arrConjs[5][1].toString()  === '-❌' ? '-❌' : (arrConjs[14][1] ?? arrConjs[5][2].toString())); 
    arrConjs[14][2] = (arrConjs[11][2].toString() === '-❌' ? '-❌' : arrConjs[11][2].toString());
    arrConjs[14][3] = (arrConjs[11][3].toString() === '-❌' ? '-❌' : arrConjs[11][3].toString());
    //This next (vos) form requires removal of ending "s" from the source-formed-verb;
 	//TODO: if no ending-s console.log(`Infinitive ${@sInfinitive}, VerbTense 14 error: missing expected ending "s" char.`);
    arrConjs[14][4] = ((arrConjs[5][4].toString().slice(-2) ?? '-❌')  === '-❌' ? '-❌' : (arrConjs[14][4] ?? arrConjs[5][4].toString().slice(0,-1)));  
    arrConjs[14][5] = (arrConjs[11][5].toString() === '-❌' ? '-❌' : arrConjs[11][5].toString());   

    arrConjs[15][0] = '-❌';
    arrConjs[15][1] = (arrConjs[11][1].toString() === '-❌' ? '-❌' : arrConjs[11][1].toString()); 
    arrConjs[15][2] = (arrConjs[11][2].toString() === '-❌' ? '-❌' : arrConjs[11][2].toString()); 
    arrConjs[15][3] = (arrConjs[11][3].toString() === '-❌' ? '-❌' : arrConjs[11][3].toString()); 
    arrConjs[15][4] = (arrConjs[11][4].toString() === '-❌' ? '-❌' : arrConjs[11][4].toString()); 
    arrConjs[15][5] = (arrConjs[11][5].toString() === '-❌' ? '-❌' : arrConjs[11][5].toString()); 


    /*═══════════════════════════════════════════════════════════════════════════════════════
    Since the TER forms are needed for compound-verb-forms, including within TER itself,
    the TER array is our current array IF this is the first-run (building TER verbs), otherwise
    it is the arrTerConjs.  
    ═══════════════════════════════════════════════════════════════════════════════════════*/
    const ptrTerArray = (VerboInfinitivo === 'ter' ? arrConjs : arrTerConjs);

    //Compound forms (16 - 22) will all need past participle
    const PastParticiple = arrConjs[4][0].toString();

 
    //Build Compound Verb form.
    //Strip existing regularity-indicators from components; label all Compound forms as regular (*).
    function getBuiltCompoundVerb(terFormID, subjectID) {
        return `*${ptrTerArray[terFormID][subjectID].toString().slice(1)} ${PastParticiple.slice(1)}`; 
    }

    /*═══════════════════════════════════════════════════════════════════════════════════════
    Cycle through the Rules for each Compound VerbTense, all subjects (0-5)
    These use various TER-forms coupled to participle.
    Logic must consider whether the related base (non-compound) form is knocked-out in a 
    "defective" verb -- if so, the compound is knocked out too.
    ═══════════════════════════════════════════════════════════════════════════════════════*/
    for (let tenseID = 16; tenseID <= 22; tenseID++) {
        for (let subjectID = 0; subjectID < 6; subjectID++) {
            switch (tenseID) {
                case 16:
                    arrConjs[tenseID][subjectID] = (arrConjs[5][subjectID] === '-❌' ? '-❌' : getBuiltCompoundVerb(5, subjectID));
                    break;
                case 17:
                    arrConjs[tenseID][subjectID] = (arrConjs[7][subjectID] === '-❌' ? '-❌' : getBuiltCompoundVerb(7, subjectID));
                    break;
                //This group uses Ter-verb forms with IDs 9 through 13, which are always 9 less than current tense being calculated.
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                    arrConjs[tenseID][subjectID] = (arrConjs[tenseID - 9][subjectID] === '-❌' ? '-❌' : getBuiltCompoundVerb(tenseID - 9, subjectID));
                    break;
            } //switch
        } //for (subjects)
    } //for (compound-tenses)

    return arrConjs;

} //conjugateVerbTenses



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
This Map() is indexed on a String built up of:
VerbTenseID (zero-filled) -
VerbSubjectID (number 1-6)
OrigStemVowel (letter)
And, the associated single-letter Value for each entry is the NewStemVowel (letter) 
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/
const mapIRstemChanges = new Map([
    ['05-1e','i'],
    ['05-1o','u'],
    ['05-2u','o'],
    ['05-3u','o'],
    ['05-6u','o'],
    ['11-1e','i'],
    ['11-2e','i'],
    ['11-3e','i'],
    ['11-4e','i'],
    ['11-5e','i'],
    ['11-6e','i'],
    ['11-1o','u'],
    ['11-2o','u'],
    ['11-3o','u'],
    ['11-4o','u'],
    ['11-5o','u'],
    ['11-6o','u']
]);

// Get replacement for IR stem vowel, if one exists. E => I, O => U, U => O
export function getIRChange(TenseID, SubjectID, OrigStemVowel) {
    let NewStemVowel = mapIRstemChanges.get(TenseID.toString().padStart(2, "0") + '-' + (SubjectID + 1).toString() + OrigStemVowel);
    return NewStemVowel ?? OrigStemVowel; //if no replacement, return orig
}

export function getUserNotes(verbEnding) {
    const userNotes = mapRules.get(verbEnding)?.[14]?.toString() ?? '';
    
    return (userNotes !== '' ? `<br/>Note: ${userNotes}.` : '');
}