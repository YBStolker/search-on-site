document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("search-form-id");
  const input = document.getElementById("search-input-id");

  form.addEventListener("submit", getOnSubmit(input));
});

/**
 * @param {HTMLInputElement | null} input
 * @returns {(event: SubmitEvent) => Promise<any>}
 */
function getOnSubmit(input) {
  /**
   * @param {SubmitEvent} event
   * @returns {Promise<any>}
   */
  async function onSubmit(event) {

    event.preventDefault();

    await chrome.tabs.query({ active: true, currentWindow: true }, getOnTabQueryResult(input?.value));
  }

  return onSubmit;
}

/**
 * @param {string?} query
 * @returns {(chrome.tabs.Tab[]) => Promise<void>}
 */
function getOnTabQueryResult(query) {
  /**
   * @param {chrome.tabs.Tab[]} tabs
   * @returns {Promise<void>}
   */
  async function onTabQueryResult(tabs) {
    if (!query) {
      return;
    }

    const activeTab = tabs[0];
    const url = new URL(activeTab.url);
    if (!url?.origin) {
      return;
    }

    const searchUrl = `site:${url.origin} ${query}`;
    chrome.search.query({
      text: searchUrl,
      disposition: "CURRENT_TAB",
    });
  }

  return onTabQueryResult;
}
