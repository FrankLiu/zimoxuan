// ES5
function DisplayComponent() {
  this.myName = "Alice";
  this.names = ["Aarav", "Mart¨ªn", "Shannon", "Ariana", "Kai"];
}
DisplayComponent.annotations = [
  new angular.ComponentAnnotation({
    selector: "display"
  }),
  new angular.ViewAnnotation({
    template:
       '<p>My name: {{ myName }}</p>'
  })
];