const form = document.querySelector("#search-form");
const input = document.querySelector("#country");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const country = input.value.trim();
  if (!country) return;
  results.replaceChildren();
  status.textContent = "Searching…";
  try {
    const url = new URL("https://universities.hipolabs.com/search");
    url.searchParams.set("country", country);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`University service returned HTTP ${response.status}`);
    const universities = await response.json();
    if (!Array.isArray(universities)) throw new Error("The university service returned an unexpected response.");
    if (universities.length === 0) {
      status.textContent = "No universities found. Check the country name and try again.";
      return;
    }
    for (const university of universities) {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = university.name || "Unnamed university";
      item.append(name);
      if (university["state-province"]) {
        const province = document.createElement("span");
        province.className = "state";
        province.textContent = ` — ${university["state-province"]}`;
        item.append(province);
      }
      const sites = Array.isArray(university.web_pages) ? university.web_pages : [];
      for (const website of sites) {
        try {
          const parsed = new URL(website);
          if (parsed.protocol !== "https:" && parsed.protocol !== "http:") continue;
          const link = document.createElement("a");
          link.href = parsed.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = website;
          item.append(document.createElement("br"), link);
        } catch {
          continue;
        }
      }
      results.append(item);
    }
    status.textContent = `Found ${universities.length} universities.`;
  } catch (cause) {
    status.textContent = cause instanceof Error ? cause.message : "Could not load universities.";
  }
});
