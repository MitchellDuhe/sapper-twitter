const createAutocomplete = (src)=>{
  const autoCompletejs = new autoComplete({
    data: {
      src,
      key: ["name", "handle"],
    },
    sort: function (a, b) {
      if (a.match < b.match) {
        return -1;
      }
      if (a.match > b.match) {
        return 1;
      }
      return 0;
    },
    query: {
      manipulate: function (query) {
        return query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      },
    },
    trigger: {
      event: ["input","focusin", "focusout"],
      condition: function (query) {
        return !!query.replace(/ /g, "").length && query !== "hamburger";
      },
    },
    placeHolder: "Type Here",
    selector: "#autoComplete",
    debounce: 0,
    searchEngine: "loose",
    highlight: true,
    maxResults: 10,
    resultsList: {
      render: false,
      container: null,//function (source) {source.setAttribute("id", "autoComplete_list");},
      element: "ul",
      destination: document.querySelector("#autoComplete"),
      position: "afterend",
    },
    resultItem: {
      content: null, //function (data, source) {source.innerHTML = data.match;},
      element: "li",
    },
    noResults: function () {
      const result = document.createElement("li");
      result.setAttribute("class", "no_result");
      result.setAttribute("tabindex", "1");
      result.innerHTML = "No Results";
      document.querySelector("#autoComplete_list").appendChild(result);
    },
    onSelection: function (feedback) {
      document.querySelector("#autoComplete").blur();
      const selection = feedback.selection.value.food;
      // Render selected choice to selection div
      document.querySelector(".selection").innerHTML = selection;
      // Clear Input
      document.querySelector("#autoComplete").value = "";
      // Change placeholder with the selected value
      document.querySelector("#autoComplete").setAttribute("placeholder", selection);
      // Concole log autoComplete data feedback
      console.log(feedback);
    },
  });
}

export default createAutocomplete;