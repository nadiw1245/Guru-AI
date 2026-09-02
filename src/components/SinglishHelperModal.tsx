import React from 'react';
import { X, Keyboard, Check, Copy } from 'lucide-react';

interface SinglishHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText?: (text: string) => void;
}

const COMMON_SINHALA_TERMS = [
  { sinhala: 'ප්‍රභාසංස්ලේෂණය', en: 'Photosynthesis', singlish: 'prabhasansleshana' },
  { sinhala: 'නිව්ටන්ගේ නියම', en: "Newton's Laws", singlish: 'newtonge niyama' },
  { sinhala: 'උද්ධමනය', en: 'Inflation', singlish: 'uddhamanaya' },
  { sinhala: 'ඝනත්වය', en: 'Density', singlish: 'ghanathwaya' },
  { sinhala: 'ක්‍රමලේඛනය', en: 'Programming', singlish: 'kramalekhanaya' },
  { sinhala: 'ගුරුත්වාකර්ෂණය', en: 'Gravity', singlish: 'guruthwakarshanaya' },
  { sinhala: 'පැවරුම සඳහා උදව් කරන්න', en: 'Help with assignment', singlish: 'pewaruma sadaha udaw karanna' },
  { sinhala: 'සරල උපමාවකින් කියන්න', en: 'Explain with simple analogy', singlish: 'sarala upamawakin kiyanna' },
];

const PHONETIC_MAP = [
  { char: 'අ, ආ', keys: 'a, aa / A' },
  { char: 'ඇ, ඈ', keys: 'ae, aae' },
  { char: 'ඉ, ඊ', keys: 'i, ii / ee' },
  { char: 'උ, ඌ', keys: 'u, uu / oo' },
  { char: 'එ, ඒ', keys: 'e, ee' },
  { char: 'ඔ, ඕ', keys: 'o, oo' },
  { char: 'ක, ග, ච, ජ', keys: 'k, g, c/ch, j' },
  { char: 'ත, ද, ප, බ', keys: 't, d, p, b' },
  { char: 'ට, ඩ, ණ, ළ', keys: 'T, D, N, L' },
  { char: 'ය, ර, ල, ව, ස, හ', keys: 'y, r, l, w/v, s, h' },
  { char: 'ං (අනුස්වාරය)', keys: 'x / ng' },
];

export const SinglishHelperModal: React.FC<SinglishHelperModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
}) => {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
    if (onInsertText) {
      onInsertText(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">සිංහල / Singlish ටයිප් කිරීමේ සහාය</h3>
              <p className="text-xs text-slate-500">ඔබට සිංහලෙන් හෝ ඉංග්‍රීසියෙන් ඕනෑම ආකාරයකට ප්‍රශ්න ඇසිය හැක</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-amber-900 leading-relaxed">
            💡 <strong>දැනුවත් කිරීම:</strong> ඔබට ප්‍රශ්න ඇසීමට <strong>සිංහල අකුරු</strong>, <strong>Singlish (English අකුරින් සිංහල)</strong>, හෝ <strong>English</strong> ඕනෑම ක්‍රමයක් භාවිතා කළ හැක. AI ගුරුතුමා ඔබට සැමවිටම පැහැදිලි සිංහල උපමා මඟින් පිළිතුරු සපයනු ඇත!
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">නිතර භාවිතා වන වචන (ක්ලික් කර පහසුවෙන් ලබාගන්න):</h4>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_SINHALA_TERMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopy(item.sinhala)}
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition-all group"
                >
                  <div>
                    <span className="font-medium text-slate-900 block">{item.sinhala}</span>
                    <span className="text-[10px] text-slate-500 block">{item.en} ({item.singlish})</span>
                  </div>
                  {copiedText === item.sinhala ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Singlish අකුරු යතුරු පුවරු ඉඟි (Phonetic Guide):</h4>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {PHONETIC_MAP.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 px-1.5 border-b border-slate-200/50 last:border-0">
                  <span className="font-medium text-slate-900">{item.char}</span>
                  <code className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-amber-800">
                    {item.keys}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            තේරුම් ගත්තා (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
