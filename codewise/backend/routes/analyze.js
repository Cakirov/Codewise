const express = require("express");
const router = express.Router();
const axios = require("axios");


const MAX_CODE_LINES = 50;

const MAX_TOKENS = 4000;

router.post("/", async (req, res) => {
  const { code, language, mode } = req.body;


  const codeLines = code.split('\n').length;
  if (codeLines > MAX_CODE_LINES) {
    return res.status(400).json({ 
      error: `Kod çok uzun. Maksimum ${MAX_CODE_LINES} satır kabul edilebilir. Şu anki kod: ${codeLines} satır.` 
    });
  }

  
  if (!code.trim()) {
    return res.status(400).json({ error: "Analiz için kod gerekli." });
  }


  const languageSpecificPrompts = {
    python: {
      explanation: `Explain what this Python code does. Focus on Python-specific concepts like:
- List comprehensions
- Python's dynamic typing
- Python's GIL (Global Interpreter Lock)
- Python's memory management
- Python's standard library usage

Code:
${code}`,
      analysis: `Analyze this Python code and provide detailed feedback. Focus on Python-specific aspects:

1. ❌ Python Syntax & Style
- PEP 8 compliance
- Python-specific syntax errors
- Proper use of Python idioms
- Indentation issues
- Show which line has which error

2. ⚙️ Python Performance
- GIL impact
- Memory usage
- List vs Generator expressions
- Proper use of built-in functions
- Algorithm efficiency

3. 🛡️ Python Security
- Input validation
- Safe eval() usage
- File handling security
- Module import security
- Environment variable handling

4. 📌 Python Best Practices
- Proper use of virtual environments
- Dependency management
- Documentation standards
- Testing practices
- Error handling patterns

Code:
${code}`,
      fix: `Fix and improve this Python code. Focus on:
- Fixing syntax errors
- Improving code style and readability
- Optimizing performance
- Following Python best practices
- Adding proper error handling

Return only the fixed code without any explanations.

Code:
${code}`
    },
    javascript: {
      explanation: `Explain what this JavaScript code does. Focus on JavaScript-specific concepts like:
- Event loop and asynchronous programming
- Closures and scope
- Prototypal inheritance
- ES6+ features
- Browser/DOM interactions

Code:
${code}`,
      analysis: `Analyze this JavaScript code and provide detailed feedback. Focus on JavaScript-specific aspects:

1. ❌ JavaScript Syntax & Style
- ES6+ features usage
- Proper semicolon usage
- Variable declaration (var/let/const)
- Strict mode compliance
- Async/await vs Promises
- Show which line has which error

2. ⚙️ JavaScript Performance
- Event loop optimization
- Memory leaks
- DOM manipulation efficiency
- Closure memory usage
- Event listener management

3. 🛡️ JavaScript Security
- XSS prevention
- CSRF protection
- Input sanitization
- Secure cookie handling
- API security

4. 📌 JavaScript Best Practices
- Module patterns
- Error handling
- Code organization
- Browser compatibility
- Testing practices

Code:
${code}`,
      fix: `Fix and improve this JavaScript code. Focus on:
- Fixing syntax errors
- Improving code style and readability
- Optimizing performance
- Following JavaScript best practices
- Adding proper error handling

Return only the fixed code without any explanations.

Code:
${code}`
    },
    java: {
      explanation: `Explain what this Java code does. Focus on Java-specific concepts like:
- Object-oriented principles
- Memory management
- Exception handling
- Java collections
- Threading model

Code:
${code}`,
      analysis: `Analyze this Java code and provide detailed feedback. Focus on Java-specific aspects:

1. ❌ Java Syntax & Style
- Proper class structure
- Exception handling
- Generics usage
- Access modifiers
- Interface implementation
- Show which line has which error

2. ⚙️ Java Performance
- Memory management
- Garbage collection
- Thread safety
- Collection efficiency
- I/O operations

3. 🛡️ Java Security
- Input validation
- Exception handling
- Resource management
- Access control
- Secure coding practices

4. 📌 Java Best Practices
- Design patterns
- SOLID principles
- Documentation
- Testing practices
- Build management

Code:
${code}`
    },
    c: {
      explanation: `Explain what this C code does. Focus on C-specific concepts like:
- Memory management
- Pointer arithmetic
- Struct usage
- Preprocessor directives
- Low-level operations

Code:
${code}`,
      analysis: `Analyze this C code and provide detailed feedback. Focus on C-specific aspects:

1. ❌ C Syntax & Style
- Pointer usage
- Memory allocation
- Header file organization
- Preprocessor usage
- Type safety
- Show which line has which error

2. ⚙️ C Performance
- Memory efficiency
- Algorithm optimization
- Cache utilization
- I/O operations
- Compiler optimization

3. 🛡️ C Security
- Buffer overflows
- Memory leaks
- Pointer safety
- Input validation
- Resource management

4. 📌 C Best Practices
- Code organization
- Documentation
- Error handling
- Testing practices
- Build process

Code:
${code}`
    },
    "c++": {
      explanation: `Explain what this C++ code does. Focus on C++-specific concepts like:
- Object-oriented features
- Templates
- STL usage
- Smart pointers
- Modern C++ features

Code:
${code}`,
      analysis: `Analyze this C++ code and provide detailed feedback. Focus on C++-specific aspects:

1. ❌ C++ Syntax & Style
- Modern C++ features
- Class design
- Template usage
- Exception handling
- RAII principles

2. ⚙️ C++ Performance
- Memory management
- STL efficiency
- Move semantics
- Compiler optimization
- Cache utilization

3. 🛡️ C++ Security
- Smart pointer usage
- Exception safety
- Resource management
- Input validation
- Memory safety

4. 📌 C++ Best Practices
- Design patterns
- SOLID principles
- Documentation
- Testing practices
- Build system

Code:
${code}`
    },
    "c#": {
      explanation: `Explain what this C# code does. Focus on C#-specific concepts like:
- .NET framework features
- LINQ usage
- Async/await patterns
- Properties and events
- Exception handling

Code:
${code}`,
      analysis: `Analyze this C# code and provide detailed feedback. Focus on C#-specific aspects:

1. ❌ C# Syntax & Style
- Modern C# features
- LINQ usage
- Async/await patterns
- Exception handling
- Property patterns
- Show which line has which error

2. ⚙️ C# Performance
- Memory management
- Garbage collection
- Async operations
- LINQ efficiency
- Resource disposal

3. 🛡️ C# Security
- Input validation
- Exception handling
- Resource management
- Access control
- Secure coding

4. 📌 C# Best Practices
- Design patterns
- SOLID principles
- Documentation
- Testing practices
- Dependency management

Code:
${code}`
    },
    html: {
      explanation: `Explain what this HTML code does. Focus on HTML-specific concepts like:
- Document structure
- Semantic elements
- Forms and inputs
- Accessibility features
- Meta information

Code:
${code}`,
      analysis: `Analyze this HTML code and provide detailed feedback. Focus on HTML-specific aspects:

1. ❌ HTML Syntax & Structure
- Proper nesting
- Required attributes
- DOCTYPE declaration
- Character encoding
- Meta tags
- Show which line has which error

2. ⚙️ HTML Performance
- Resource loading
- Image optimization
- Script placement
- CSS organization
- Page structure

3. 🛡️ HTML Security
- Form security
- Input validation
- XSS prevention
- Content security
- Data handling

4. 📌 HTML Best Practices
- Semantic markup
- Accessibility
- SEO optimization
- Mobile responsiveness
- Documentation

Code:
${code}`
    },
    css: {
      explanation: `Explain what this CSS code does. Focus on CSS-specific concepts like:
- Selectors and specificity
- Box model
- Layout techniques
- Responsive design
- CSS variables

Code:
${code}`,
      analysis: `Analyze this CSS code and provide detailed feedback. Focus on CSS-specific aspects:

1. ❌ CSS Syntax & Structure
- Selector specificity
- Property usage
- Value formats
- Media queries
- CSS organization
- Show which line has which error



2. ⚙️ CSS Performance
- Selector efficiency
- Animation performance
- Layout calculations
- Resource loading
- Render blocking

3. 🛡️ CSS Security
- Content security
- Resource integrity
- Cross-origin issues
- Data handling
- Privacy concerns

4. 📌 CSS Best Practices
- BEM methodology
- Responsive design
- Browser compatibility
- Documentation
- Maintainability



Code:
${code}`
    }
  };

  try {
    const prompt = mode === "explanation" 
      ? languageSpecificPrompts[language]?.explanation || `Explain what this ${language} code does.`
      : mode === "fix"
      ? languageSpecificPrompts[language]?.fix || `Fix and improve this ${language} code.`
      : languageSpecificPrompts[language]?.analysis || `Analyze this ${language} code.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: MAX_TOKENS, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resultText = response.data.choices[0].message.content;
    res.json({ analysis: resultText });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    if (error.response?.status === 413) {
      res.status(413).json({ error: "Kod çok uzun. Lütfen daha kısa bir kod parçası deneyin." });
    } else {
      res.status(500).json({ error: "Analysis failed." });
    }
  }
});

module.exports = router;
