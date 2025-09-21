// ===== Options List =====
const optionsList = [
  { key: "skill", label: "teach or assess a skill", text: "This should be a simple educational app that my learners can use that is interactive and gamified. It should NOT use simple tools like textboxes and radio buttons as in primitive interfaces; it should be much more creative than that. It should give users immediate feedback about right and wrong answers and then give them the chance to try again." },
  { key: "data", label: "collect data from a user", text: "Include an option for the trainee to export results as CSV to send to their instructors or supervisors." },
  { key: "feedback", label: "allow user to provide feedback", text: "The app should collect information from users in a very creative interface, using a combination of closed and open ended responses form the user. It should then be able to summarize the inputted data in multiple neat formats, including plain text and downloadable CSV." },
  { key: "game", label: "play a game with the user", text: "The app should be a simple and intuitive single-player game that the user plays. The game should have a clear objective that the player needs to achieve, with clear instructions. The user should be able to understand or track their progress as they play. Include functionality to export results and then play again." },
  { key: "other", label: "other", text: null }
];

// ===== Inject Minimal Styles (scoped) =====
(function injectStyles(){
  if (document.getElementById("prompt-generator-styles")) return;
  const style = document.createElement("style");
  style.id = "prompt-generator-styles";
  style.textContent = `
    /* Ensure label/input stack nicely */
    .prompt-generator label {
      display: block;
      margin-top: 10px;
    }
    .prompt-generator .userGoals {
      display: block;
      margin-top: 6px;
      width: 100%;
      box-sizing: border-box;
    }
    /* Narrow "other" text box */
    .prompt-generator input[type="text"].otherUserUse {
      margin-left: 8px;
      width: 200px;
      display: inline-block;
    }
    /* Output box spacing */
    .prompt-generator .prompt-output {
      margin-top: 20px;
      display: none;
    }
    .prompt-generator .prompt-box {
      white-space: pre-wrap;
    }
  `;
  document.head.appendChild(style);
})();

// ===== Initialization Function =====
function setupPromptGenerator(container) {
  container.innerHTML = `
    <h3>Prompt Generator</h3>
    <label>
      Briefly describe what you want your app to do:
      <input type="text" class="userGoals" placeholder="e.g., Help students practice medication safety">
    </label>

    <p>What all will your app do? (select all that apply)</p>
    <div class="checkboxes"></div>

    <button class="generateBtn btn success">Generate Prompt</button>

    <div class="prompt-output">
      <p><strong>Please copy-paste the prompt below into an AI chatbot:</strong></p>
      <div class="prompt-box callout"></div>
      <button class="copyBtn btn"><span>📋</span> Copy Prompt</button>
    </div>
  `;

  const checkboxesDiv = container.querySelector(".checkboxes");

  // Build checkboxes dynamically
  optionsList.forEach(opt => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = opt.key;
    label.appendChild(cb);
    label.append(" " + opt.label);

    if (opt.key === "other") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "otherUserUse";
      input.placeholder = "Please specify";
      label.appendChild(input);
    }
    checkboxesDiv.appendChild(label);
  });

  const btn = container.querySelector(".generateBtn");
  const outputDiv = container.querySelector(".prompt-output");
  const promptBox = container.querySelector(".prompt-box");
  const userGoalsInput = container.querySelector(".userGoals");
  const copyBtn = container.querySelector(".copyBtn");

  // Copy button
  copyBtn.addEventListener("click", () => {
    const text = promptBox.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert("Prompt copied to clipboard!");
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      alert("Prompt copied to clipboard!");
    });
  });

  // Generate prompt button
  btn.addEventListener("click", () => {
    const userGoals = userGoalsInput.value.trim() || "[no goals entered]";

    let prompt = `using only html and vanilla JS (for easy embedding in different places without needing anything external), make a creative interactive tool that achieves the following: ${userGoals}. Remember that this should use the interactive power of JS and not just have standard boring interfaces. Provide the code for a single html file only.`;

    checkboxesDiv.querySelectorAll("input[type=checkbox]").forEach(cb => {
      if (cb.checked) {
        const opt = optionsList.find(o => o.key === cb.value);
        if (opt.key === "other") {
          const otherVal = checkboxesDiv.querySelector(".otherUserUse").value.trim();
          if (otherVal) {
            prompt += " The app should also do this: " + otherVal;
          }
        } else {
          prompt += " " + opt.text;
        }
      }
    });

    promptBox.textContent = prompt;
    outputDiv.style.display = "block";
  });
}

// ===== Auto-setup for all instances =====
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".prompt-generator").forEach(pg => setupPromptGenerator(pg));
});
