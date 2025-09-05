import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit  {
  ngOnInit(): void {
    document.addEventListener("DOMContentLoaded", function() {
      var titleElements = document.querySelectorAll(".title");
      // var buttonElement = document.querySelector(".button");

      lettering(titleElements);
      // lettering([buttonElement]);

      animation();

      // buttonElement.addEventListener("click", function() {
      //     animation();
      // });
      setInterval(animation, 4000);
    });

    // @ts-ignore
    function lettering(elements) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var letters = element.textContent.split("");
        element.innerHTML = "";

        for (var j = 0; j < letters.length; j++) {
          var letter = document.createElement("span");
          letter.textContent = letters[j];
          element.appendChild(letter);
        }
      }
    }

    function animation() {
      let title1 = new TimelineMax();
      title1.to(".button", 0, { visibility: "hidden", opacity: 0 });
      title1.staggerFromTo(
        ".title span",
        0.5,
        { ease: Back.easeOut.config(1.7), opacity: 0, bottom: -80 },
        { ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0 },
        0.05
      );
      title1.to(".button", 0.2, { visibility: "visible", opacity: 1 });
    }
  }
}
