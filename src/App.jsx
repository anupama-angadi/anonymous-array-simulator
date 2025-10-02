import React, { useState } from "react";

export default function MultilevelInheritanceSimulator() {
  const [step, setStep] = useState(1);
  const [levels, setLevels] = useState(3);  // default number of levels
  const [classDefs, setClassDefs] = useState([]);  // array of class definitions
  const [generatedCode, setGeneratedCode] = useState("");
  const [output, setOutput] = useState("");

  // Step 1 → initialize class definitions
  const handleNextFromLevels = () => {
    const lv = parseInt(levels) || 0;
    if (lv < 2) {
      alert("Enter at least 2 levels");
      return;
    }
    // initialize each level with default class name and method
    const arr = Array.from({ length: lv }, (_, i) => ({
      name: `Class${i + 1}`,
      method: `print${i + 1}()`,
      body: `System.out.println("${i + 1}");`
    }));
    setClassDefs(arr);
    setStep(2);
  };

  const handleClassDefChange = (idx, field, value) => {
    const newDefs = [...classDefs];
    newDefs[idx][field] = value;
    setClassDefs(newDefs);
  };

  const handleExecute = () => {
    // Build Java program
    // Create class declarations with extends
    const lv = classDefs.length;
    const classLines = classDefs.map((cd, i) => {
      const extendPart = i === 0 ? "" : ` extends ${classDefs[i - 1].name}`;
      return `class ${cd.name}${extendPart} {\n  void ${cd.method} {\n    ${cd.body}\n  }\n}`;
    });

    const mainCall = classDefs
      .map((cd) => `        obj.${cd.method.replace("()", "")}();`)
      .join("\n");

    const code =
      classLines.join("\n\n") +
      `\n\npublic class Test {\n  public static void main(String[] args) {\n    ${classDefs[classDefs.length - 1].name} obj = new ${classDefs[classDefs.length - 1].name}();\n` +
      mainCall +
      `\n  }\n}`;

    setGeneratedCode(code);

    // Simulate output: just show the output lines as per the bodies
    // We assume each body prints one line as given
    const outLines = classDefs.map((cd) => {
      // extract the string inside quotes if possible
      const match = cd.body.match(/"([^"]*)"/);
      return match ? match[1] : cd.body;
    });
    setOutput(outLines.join("\n"));

    setStep(3);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Multilevel Inheritance Simulator</h1>

      {step === 1 && (
        <div>
          <h2>Step 1: Number of Levels</h2>
          <input
            type="number"
            value={levels}
            onChange={(e) => setLevels(e.target.value)}
          />
          <button onClick={handleNextFromLevels}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2: Define Classes</h2>
          {classDefs.map((cd, idx) => (
            <div key={idx} style={{ marginBottom: "16px", border: "1px solid #ccc", padding: "8px" }}>
              <div>
                <label>Class Name: </label>
                <input
                  value={cd.name}
                  onChange={(e) => handleClassDefChange(idx, "name", e.target.value)}
                />
              </div>
              <div>
                <label>Method Name: </label>
                <input
                  value={cd.method}
                  onChange={(e) => handleClassDefChange(idx, "method", e.target.value)}
                />
              </div>
              <div>
                <label>Method Body (System.out.print…): </label>
                <input
                  value={cd.body}
                  onChange={(e) => handleClassDefChange(idx, "body", e.target.value)}
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          ))}
          <button onClick={() => setStep(1)}>← Previous</button>
          <button onClick={handleExecute}>Execute</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Generated Java Program</h2>
          <pre style={{ border: "1px solid black", padding: "8px" }}>{generatedCode}</pre>
          <h2>Output</h2>
          <pre style={{ border: "1px solid black", padding: "8px" }}>{output}</pre>
          <button onClick={() => setStep(2)}>← Previous</button>
        </div>
      )}
    </div>
  );
}
