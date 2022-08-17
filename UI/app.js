Dropzone.autoDiscover = false;
let key = null;
var players = {
  lionel_messi: 0,
  maria_sharapova: 1,
  roger_federer: 2,
  serena_williams: 3,
  virat_kohli: 4,
};
var numbers = {
  0: "one",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
};
function init() {
  let dz = new Dropzone("#dropzone", {
    url: "/",
    maxFiles: 1,
    addRemoveLinks: true,
    dictDefaultMessage: "Some Message",
    autoProcessQueue: false,
  });

  dz.on("addedfile", function () {
    if (dz.files[1] != null) {
      dz.removeFile(dz.files[0]);
    }
  });

  dz.on("complete", function (file) {
    let imageData = file.dataURL;

    var url = "http://127.0.0.1:5000/classify_image";

    $.post(
      url,
      {
        image_data: file.dataURL,
      },
      function (data, status) {
        if (!data || data.length == 0) {
          $("#hideDropZone").hide();
          $("#resultHolder").hide();
          $("#divClassTable").hide();
          $("#error").show();
          return;
        } else {
          key = data["0"]["class"];
          changeStuff();
        }

        let players = [
          "lionel_messi",
          "maria_sharapova",
          "roger_federer",
          "serena_williams",
          "virat_kohli",
        ];

        let match = null;
        let bestScore = -1;
        for (let i = 0; i < data.length; ++i) {
          let maxScoreForThisClass = Math.max(...data[i].class_probability);
          if (maxScoreForThisClass > bestScore) {
            match = data[i];
            bestScore = maxScoreForThisClass;
          }
        }
        if (match) {
          $("#error").hide();
          // $("#resultHolder").show();
          // $("#divClassTable").show();
          // $("#resultHolder").html($(`[data-player="${match.class}"`).html());
          // let classDictionary = match.class_dictionary;
          // for (let personName in classDictionary) {
          //   let index = classDictionary[personName];
          //   let proabilityScore = match.class_probability[index];
          //   let elementName = "#score_" + personName;
          //   $(elementName).html(proabilityScore);
          // }
        }
        // dz.removeFile(file);
      }
    );
  });

  $("#submitBtn").on("click", function (e) {
    $("centerThis").hide();
    dz.processQueue();
  });
  $("#refreshBtn").on("click", function (e) {
    location.reload(true);
  });
}

$(document).ready(function () {
  console.log("ready!");
  $("#error").hide();
  $("#resultHolder").hide();
  $("#divClassTable").hide();

  init();
});
function changeStuff() {
  console.log(players[key]);
  let finalKey = players[key];
  document.getElementsByClassName(numbers[finalKey])[0].style.border =
    "4px solid green";

  console.log("clicked");
}
function refreshPage() {
  location.reload();
}
// function hideDiv() {
//   console.log("clicked");
//   console.log(document.getElementsByClassName("centerThis")[0]);
//   document.getElementsByClassName("centerThis")[0].style.display = "none";
// }
