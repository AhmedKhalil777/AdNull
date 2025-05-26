# AdNull - Arabic Language Support Guide

## 🇸🇦 دعم اللغة العربية - Arabic Language Support

### المشكلة - The Problem
Extension was not working when YouTube interface is in Arabic because skip buttons have Arabic text and aria-labels.

### الحل - The Solution (v1.0.2)
Added comprehensive Arabic language support with:

## 🎯 Arabic Skip Button Patterns

### Text Patterns Added:
- `تخطي` - Skip
- `تخطى` - Skip (alternative spelling)
- `تجاوز` - Skip/Bypass
- `تخطي الإعلان` - Skip Ad
- `تخطى الإعلان` - Skip Ad (alternative)

### CSS Selectors Added:
```css
button[aria-label*="تخطي"]
button[aria-label*="تخطى"] 
button[aria-label*="تجاوز"]
.ad-container button[aria-label*="تخطي"]
```

## 🧪 Testing Arabic Support

### 1. Quick Test
```javascript
// Test Arabic language detection
window.adnullTestArabic()
```

### 2. Check Language Detection
```javascript
// Should return 'ar' for Arabic
window.adnullDebug().language
```

### 3. Manual Arabic Button Search
```javascript
// Look for Arabic skip buttons
document.querySelectorAll('button[aria-label*="تخطي"]')
document.querySelectorAll('button[aria-label*="تخطى"]')
document.querySelectorAll('button[aria-label*="تجاوز"]')

// Look for Arabic text in elements
const buttons = document.querySelectorAll('button, div, span');
Array.from(buttons).filter(btn => 
  btn.textContent && (
    btn.textContent.includes('تخطي') || 
    btn.textContent.includes('تخطى') || 
    btn.textContent.includes('تجاوز')
  )
);
```

## 🔍 Language Detection Methods

The extension detects Arabic in multiple ways:

### 1. HTML Lang Attribute
```javascript
document.documentElement.lang // e.g., "ar" or "ar-SA"
```

### 2. URL Parameters
```javascript
// YouTube language parameter
new URLSearchParams(window.location.search).get('hl') // e.g., "ar"
```

### 3. Arabic Text Detection
```javascript
// Regex pattern for Arabic Unicode range
const arabicPattern = /[\u0600-\u06FF]/;
arabicPattern.test(document.body.textContent)
```

## 🌍 Multilingual Support

Extension now supports 10+ languages:

| Language | Skip Text Examples |
|----------|-------------------|
| **Arabic** | تخطي، تخطى، تجاوز |
| English | Skip, Skip Ad |
| Spanish | Omitir, Saltar |
| French | Ignorer, Passer |
| German | Überspringen |
| Portuguese | Pular, Ignorar |
| Russian | Пропустить |
| Chinese | 跳过, 跳過 |
| Japanese | スキップ |
| Korean | 건너뛰기 |

## 🚀 How It Works

### 1. Language Detection
```javascript
detectPageLanguage() {
  // Check HTML lang attribute
  // Check URL parameters  
  // Check for Arabic text patterns
  // Default to English
}
```

### 2. Prioritized Text Patterns
```javascript
getLanguageSpecificSkipTexts() {
  if (language === 'ar') {
    // Arabic patterns first, then all others
    return ['تخطي', 'تخطى', 'تجاوز', ...allPatterns];
  }
  return allPatterns;
}
```

### 3. Enhanced Search
- Searches button text content
- Searches aria-label attributes
- Searches multiple element types (button, div, span, a)
- Uses language-specific patterns first

## 🛠️ Troubleshooting Arabic Issues

### Issue: Extension not detecting Arabic
```javascript
// Check language detection
console.log('Detected language:', window.adnullDebug().language);

// Should show Arabic patterns first
console.log('Skip patterns:', window.adnullDebug().skipTexts);
```

### Issue: Arabic buttons not found
```javascript
// Manual search for Arabic buttons
window.adnullTestArabic()

// Look at the foundArabicButtons and foundArabicText arrays
```

### Issue: Buttons found but not clickable
```javascript
// Check if buttons are clickable
const arabicButtons = document.querySelectorAll('button[aria-label*="تخطي"]');
arabicButtons.forEach(btn => {
  console.log('Button:', btn);
  console.log('Clickable:', window.AdNullSkipper.isButtonClickable(btn));
});
```

## 📱 Testing on Arabic YouTube

### 1. Set YouTube to Arabic
- Go to YouTube settings
- Change language to العربية (Arabic)
- Or visit: `https://www.youtube.com/?hl=ar`

### 2. Test with Ads
- Find a video with ads
- Open console (F12)
- Run: `window.adnullTestArabic()`

### 3. Expected Results
```javascript
{
  language: "ar",
  isArabic: true,
  arabicSkipTexts: ["تخطي", "تخطى", "تجاوز"],
  foundArabicButtons: [...], // Should find buttons when ads play
  foundArabicText: [...]     // Should find text elements
}
```

## 🎉 Success Indicators

### ✅ Working Correctly:
- `language: "ar"` detected
- Arabic skip patterns in debug output
- Arabic buttons found during ads
- Ads are skipped automatically

### ❌ Still Having Issues:
- Language not detected as "ar"
- No Arabic buttons found
- Buttons found but not clicked

## 📞 Getting Help

If Arabic support still isn't working:

1. **Run full Arabic test:**
   ```javascript
   window.adnullTestArabic()
   ```

2. **Check language detection:**
   ```javascript
   window.adnullDebug().language
   ```

3. **Share console output** with:
   - YouTube URL
   - Language settings
   - Console test results
   - Browser language settings

## 🔄 Version History

- **v1.0.2** - Added Arabic language support
- **v1.0.1** - Enhanced ad detection
- **v1.0.0** - Initial modular release

---

**الآن يدعم AdNull اللغة العربية بالكامل!**
**AdNull now fully supports Arabic language!** 🇸🇦 