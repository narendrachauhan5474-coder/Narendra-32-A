const joke = document.querySelector("#joke");
const error = document.querySelector("#error");
const button = document.querySelector("#new-joke");

button.addEventListener("click", async () => {
  button.disabled = true;
  error.textContent = "";
  joke.textContent = "Finding a joke…";
  try {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    if (!response.ok) throw new Error(`Joke service returned HTTP ${response.status}`);
    const data = await response.json();
    if (typeof data.setup !== "string" || typeof data.punchline !== "string") {
      throw new Error("The joke service returned an unexpected response.");
    }
    joke.textContent = `${data.setup} ${data.punchline}`;
  } catch (cause) {
    joke.textContent = "Sorry, a joke could not be loaded.";
    error.textContent = cause instanceof Error ? cause.message : "Check your internet connection and try again.";
  } finally {
    button.disabled = false;
  }
});
