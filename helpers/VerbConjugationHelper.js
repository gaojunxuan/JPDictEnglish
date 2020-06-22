export class VerbConjugationHelper {
    static hira = [ "わ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "い", "ゆ", "え", "よ", "ら", "り", "る", "れ", "ろ", "わ", "い", "う", "え", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ" ];
    static IsKuruVerb(word)
    {
        word = word.replace(" ", "").replace("　", "");
        if (word == "くる" || word == "来る")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    static IsSuruVerb(word)
    {
        word = word.replace(" ", "").replace("　", "");
        if (word.length >= 2 && (word == "する" || word.substring(word.length - 2) == "する"))
        {
            return true;
        }
        else if (word == "為る")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    static IsIchidan(word,tag)
    {
        //word = word.replace(" ", "").replace("　", "");
        ////var okurigana = word.substring(word.length - 2);
        if(tag.includes("一 ]") || tag.includes("[ 一段動詞 ]"))
        {
            return true;
        }
        //if (okurigana == "べる" || okurigana == "める" || okurigana == "える" || okurigana == "へる" || okurigana == "ける" || okurigana == "ぺる" || okurigana == "げる" || okurigana == "せる" || okurigana == "れる")
        //{
        //    if(tag.includes("一 ]")||tag.includes("[ 一段動詞 ]"))
        //    {
        //        return true;
        //    }
        //    return false;
        //}
        return false;
    }
    //いらっしゃる、ござる、くださる、なさる、おっしゃる
    static IsSpecialKeigo(word)
    {
        if (word == "いらっしゃる" | word == "ござる" | word == "御座る" | word == "なさる" | word == "為さる" | word == "くださる" | word == "下さる" | word == "おっしゃる" | word == "仰しゃる")
        {
            return true;
        }
        return false;
    }
    //問う、訪う、請う、乞う
    static IsUOnbin(word)
    {
        if(word== "問う"|word== "訪う"|word== "請う" | word== "乞う" | word=="とう"|word=="こう")
        {
            return true;
        }
        return false;
    }
    static IsNegative(word)
    {
        return word.length>2&&word.endsWith("ない");
    }
    static IsCausative(word)
    {
        return word.length > 2 && word.endsWith("せる");
    }
    static IsPassive(word)
    {
        return word.length > 2 && word.endsWith("れる");
    }
    static IsMasu(word)
    {
        return word.length > 2 && word.endsWith("ます");
    }
    
    
    static PrepGodanVerbPhoneticChange(word)
    {
        newWord = word.substring(0, word.length - 1);
        if (word[word.length - 1] == 'う' || word[word.length - 1] == 'る' || word[word.length - 1] == 'つ')
        {
            if (this.IsUOnbin(word))
                newWord = newWord + "う";
            else   
                newWord = newWord + "っ";
        }
        else if (word[word.length - 1] == 'ぬ' || word[word.length - 1] == 'む' || word[word.length - 1] == 'ぶ')
        {
            //nasal sound change
            newWord = newWord + "ん";
        }
        else if (word[word.length - 1] == 'く')
        {
            if (word[word.length - 2] == 'い' || word[word.length - 2] == 'ゆ' || word[word.length - 2] == '行' || word[word.length - 2] == '逝')
            {
                newWord = newWord + "っ";
            }
            else
            {
                newWord = newWord + "い";
            }
        }
        else if (word[word.length - 1] == 'ぐ')
        {
            newWord = newWord + "い";
        }
        else
        {
            newWord = newWord + "し";
        }
        return newWord;
    }
    
    
    static PrepNegative(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsKuruVerb(word))
        {
            if (word == "来る")
            {
                return "こな";
            }
            else
            {
                return "こな";
            }
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "しな";
            }
            else
            {
                return word.substring(0, word.length - 2) + "しな";
            }
        }
        else if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "な";
        }
        else
        {
            return this.MoveToALine(word) + "な";
        }
    }
    static PrepTeTa(word)
    {
        return this.PrepGodanVerbPhoneticChange(word);
    }
    static PrepPotential(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsKuruVerb(word))
        {
            if (word == "来る")
            {
                return "こられ";
            }
            else
            {
                return "こられ";
            }
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "でき";
            }
            else
            {
                return word.substring(0, word.length - 2) + "でき";
            }
        }
        else if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "られ";
        }
        else
        {
            return this.MoveToELine(word);
        }
    }
    static PrepPassive(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsKuruVerb(word))
        {
            if (word == "来る")
            {
                return "こられ";
            }
            else
            {
                return "こられ";
            }
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "され";
            }
            else
            {
                return word.substring(0, word.length - 2) + "され";
            }
        }
        else if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "られ";
        }
        else
        {
            return this.MoveToALine(word) + "れ";
        }
    }
    static PrepImperative(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsKuruVerb(word))
        {
            return "こい";
        }
        else if (this.IsSuruVerb(word))
        {
            return word.substring(0, word.length - 2) + "しろ(せよ)";
        }
        else if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "ろ";
        }
        else
        {
            if (this.IsSpecialKeigo(word))
            {
                return word.substring(0, word.length - 1) + "い";
            }
            return this.MoveToELine(word);
        }
    }
    static PrepCausative(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsKuruVerb(word))
        {
            if (word == "来る")
            {
                return "こられ";
            }
            else
            {
                return "こられ";
            }
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "させ";
            }
            else
            {
                return word.substring(0, word.length - 2) + "させ";
            }
        }
        else if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "させ";
        }
        else
        {
            return this.MoveToALine(word) + "せ";
        }
    }
    static PrepMasuForm(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "ま";
        }
        else if (this.IsKuruVerb(word))
        {
            if (word == "来る")
            {
                return "きま";
            }
            return "きま";
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "しま";
            }
            return word.substring(0, word.length - 2) + "しま";
        }
        else
        {
            if (this.IsSpecialKeigo(word))
            {
                return word.substring(0, word.length - 1) + "いま";
            }
            return this.MoveToILine(word) + "ま";
        }
    }
    static MoveToALine(word)
    {
        okuri = word.substring(word.length - 1);
        okuri = this.hira[this.hira.indexOf(okuri) - 2];
        return word.substring(0, word.length - 1) + okuri;
    }
    static MoveToILine(word)
    {
        okuri = word.substring(word.length - 1);
        okuri = this.hira[this.hira.indexOf(okuri) - 1];
        return word.substring(0, word.length - 1) + okuri;
    }
    static MoveToELine(word)
    {
        okuri = word.substring(word.length - 1);
        okuri = this.hira[this.hira.indexOf(okuri) + 1];
        return word.substring(0, word.length - 1) + okuri;
    }
    static MoveToOLine(word)
    {
        okuri = word.substring(word.length - 1);
        okuri = this.hira[this.hira.indexOf(okuri) + 2];
        return word.substring(0, word.length - 1) + okuri;
    }
    static MoveFromAToU(word)
    {
        okuri = word.substring(word.length - 1);
        okuri = this.hira[this.hira.indexOf(okuri) + 2];
        return word.substring(0, word.length - 1) + okuri;
    }
    static MoveFromIToU(word)
    {
        okuri = word.substring(word.length - 1);
        okuri = this.hira[this.hira.indexOf(okuri) + 1];
        return word.substring(0, word.length - 1) + okuri;
    }
    
    
    static GetTeForm(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "て";
        }
        else if (this.IsKuruVerb(word))
        {
            return "きて";
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "して";
            }
            return word.substring(0, word.length - 2) + "して";
        }
        else
        {
            var newword = this.PrepGodanVerbPhoneticChange(word);
            if (word[word.length - 1] == 'ぐ' || word[word.length - 1] == 'ぬ' || word[word.length - 1] == 'む' || word[word.length - 1] == 'ぶ')
            {
                return newword + "で";
            }
            else
            {
                return newword + "て";
            }
        }
    }
    static GetTaForm(word,tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsIchidan(word,tag))
        {
            return word.substring(0, word.length - 1) + "た";
        }
        else if (this.IsKuruVerb(word))
        {
            return "きた";
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る")
            {
                return "した";
            }
            return word.substring(0, word.length - 2) + "した";
        }
        else
        {
            var newword = this.PrepGodanVerbPhoneticChange(word);
            if (word[word.length - 1] == 'ぐ' || word[word.length - 1] == 'ぬ' || word[word.length - 1] == 'む' || word[word.length - 1] == 'ぶ')
            {
                return newword + "だ";
            }
            else
            {
                return newword + "た";
            }
        }
    }
    static GetNegative(word,tag)
    {
        if(word=="ある"||word=="有る")
        {
            return "ない";
        }
        else
            return this.PrepNegative(word, tag) + "い";
    }
    static GetPastNegative(word, tag)
    {
        return this.PrepNegative(word,tag) + "かった";
    }
    static GetEbaForm(word, tag)
    {
        if (this.IsIchidan(word, tag))
        {
            return word.substring(0, word.length - 1) + "れば";
        }
        else if (this.IsKuruVerb(word))
        {
            return "くれば";
        }
        else if (this.IsSuruVerb(word))
        {
            return word.substring(0, word.length - 1) + "れば";
        }
        else
        {
            return this.MoveToELine(word) + "ば";
        }
    }
    static GetPotential(word, tag)
    {
        if (word == "ある" || word == "有る")
        {
            return "あり得る";
        }
        return this.PrepPotential(word, tag) + "る";
    }
    static GetNegativePotential(word, tag)
    {
        return this.PrepPotential(word, tag) + "ない";
    }
    static GetPassive(word, tag)
    {
        return this.PrepPassive(word, tag) + "る";
    }
    static GetNegativePassive(word, tag)
    {
        if (word == "ある" || word == "有る")
        {
            return "あり得ない";
        }
        return this.PrepPassive(word, tag) + "ない";
    }
    static GetCausative(word, tag)
    {
        return this.PrepCausative(word, tag) + "る";
    }
    static GetNegativeCausative(word, tag)
    {
        return this.PrepCausative(word, tag) + "ない";
    }
    static GetImperative(word, tag)
    {
        return this.PrepImperative(word, tag);
    }
    static GetNegativeImperative(word)
    {
        return word + "な";
    }
    static GetVolitional(word, tag)
    {
        word = word.replace(" ", "").replace("　", "");
        if (this.IsIchidan(word, tag))
        {
            return word.substring(0, word.length - 1) + "よう";
        }
        else if (this.IsKuruVerb(word))
        {
            return "こよう";
        }
        else if (this.IsSuruVerb(word))
        {
            if (word == "為る" || word == "する")
            {
                return "しよう(そう)";
            }
            else
            {
                return word.substring(0, word.length - 2) + "しよう(そう)";
            }
        }
        else
        {
            return this.MoveToOLine(word) + "う";
        }
    }
    static GetMasuForm(word,tag)
    {
        return this.PrepMasuForm(word, tag) + "す";
    }
    static GetMasuNegative(word,tag)
    {
        return this.PrepMasuForm(word, tag) + "せん";
    }

    
    
    static FromNegativeToOriginal(word)
    {
        wordroot = word.substring(0, word.length - 2);
        okurigana = wordroot.substring(wordroot.length - 1);
        if (okurigana == "べ" || okurigana == "め" || okurigana == "え" || okurigana == "へ" || okurigana == "け" || okurigana == "ぺ" || okurigana == "げ" || okurigana == "せ" || okurigana == "れ")
            return word.substring(0, word.length - 2) + "る";
        else if(word=="こない"||word=="来ない")
        {
            return "くる";
        }
        else if(word.endsWith("しない"))
        {
            return word.substring(0, word.length - 3);
        }
        else
        {
            return this.MoveFromAToU(wordroot);
        }
    }
    static FromCausativeToOriginal(word)
    {
        wordroot = word.substring(0, word.length - 2);
        okurigana = wordroot.substring(wordroot.length - 2);
        if (okurigana == "べさ" || okurigana == "めさ" || okurigana == "えさ" || okurigana == "へさ" || okurigana == "けさ" || okurigana == "ぺさ" || okurigana == "げさ" || okurigana == "せさ" || okurigana == "れさ")
            return word.substring(0, word.length - 3) + "る";
        else if (word == "こさせる" || word == "来させる")
        {
            return "くる";
        }
        else if (word.endsWith("させる"))
        {
            return word.substring(0, word.length - 3);
        }
        else
        {
            return this.MoveFromAToU(wordroot);
        }
    }
    static FromPassiveToOriginal(word)
    {
        wordroot = word.substring(0, word.length - 2);
        okurigana = wordroot.substring(wordroot.length - 2);
        if (okurigana == "べら" || okurigana == "めら" || okurigana == "えら" || okurigana == "へら" || okurigana == "けら" || okurigana == "ぺら" || okurigana == "げら" || okurigana == "せら" || okurigana == "れら")
            return word.substring(0, word.length - 3) + "る";
        else if (word == "こられる" || word == "来られる")
        {
            return "くる";
        }
        else
        {
            return this.MoveFromAToU(wordroot);
        }
    }
    static FromMasuToOriginal(word)
    {
        wordroot = word.substring(0, word.length - 2);
        okurigana = wordroot.substring(wordroot.length - 1);
        if (okurigana == "べ" || okurigana == "め" || okurigana == "え" || okurigana == "へ" || okurigana == "け" || okurigana == "ぺら" || okurigana == "げ" || okurigana == "せ" || okurigana == "れ")
            return word.substring(0, word.length - 2) + "る";
        else if (word == "きます" || word == "来ます")
        {
            return "くる";
        }
        else if(word.endsWith("します"))
        {
            if (word == "します")
                return "する";
            else
                return word.substring(0, word.length - 4);
        }
        else
        {
            return this.MoveFromIToU(wordroot);
        }
    }
        
}